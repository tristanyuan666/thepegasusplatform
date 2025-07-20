import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

export default async function SocialHubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      {/* SocialPlatformHub component is not implemented */}
    </>
  );
}
