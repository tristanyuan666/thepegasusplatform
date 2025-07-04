import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import SocialPlatformHub from "@/components/social-platform-hub";
import DashboardNavbar from "@/components/dashboard-navbar";

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
      <SocialPlatformHub />
    </>
  );
}
