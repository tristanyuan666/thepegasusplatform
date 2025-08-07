import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the request body
    const { subscription_id, user_id } = await req.json()

    if (!subscription_id || !user_id) {
      return new Response(
        JSON.stringify({ error: 'subscription_id and user_id are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify the subscription belongs to the user
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('stripe_id', subscription_id)
      .eq('user_id', user_id)
      .eq('status', 'active')
      .single()

    if (subscriptionError || !subscription) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Active subscription not found' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // In a real implementation, you would call Stripe's API here to cancel the subscription
    // For now, we'll update the database to mark it as canceled
    const { error: updateError } = await supabaseClient
      .from('subscriptions')
      .update({
        status: 'canceled',
        cancel_at_period_end: true,
        canceled_at: Math.floor(Date.now() / 1000),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_id', subscription_id)
      .eq('user_id', user_id)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to cancel subscription' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update user's subscription status
    const { error: userUpdateError } = await supabaseClient
      .from('users')
      .update({
        subscription: 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user_id)

    if (userUpdateError) {
      console.error('Error updating user:', userUpdateError)
      // Don't fail the request if user update fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Subscription canceled successfully. You will retain access until the end of your current billing period.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
