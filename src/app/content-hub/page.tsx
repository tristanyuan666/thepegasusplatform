import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import ContentCreationHub from "@/components/content-creation-hub";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function ContentHubPage() {
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
      <ContentCreationHub />
    </>
  );
}
