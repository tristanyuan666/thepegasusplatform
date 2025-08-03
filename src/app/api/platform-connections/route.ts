import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();
    const { platform, platform_username, platform_user_id, username, follower_count, engagement_rate } = body;

    // Validate required fields
    if (!platform || !platform_username || !follower_count || !engagement_rate) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, username, follower_count, and engagement_rate are required' },
        { status: 400 }
      );
    }

    // Validate field values
    if (platform_username.trim() === "" || follower_count.toString().trim() === "" || engagement_rate.toString().trim() === "") {
      return NextResponse.json(
        { error: 'All required fields must have valid values' },
        { status: 400 }
      );
    }

    // Check if user already has a connection for this platform
    const { data: existingConnections } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .eq('is_active', true);

    // Use UPSERT to handle the unique constraint properly
    const { data, error } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: user.id,
        platform,
        platform_username,
        platform_user_id: platform_user_id || platform_username,
        username: username || platform_username,
        follower_count: parseInt(follower_count) || 0,
        engagement_rate: parseFloat(engagement_rate) || 0.0,
        is_active: true,
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,platform'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, success: true });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 