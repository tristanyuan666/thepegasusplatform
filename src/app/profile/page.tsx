import { createClient } from "../../src/supabase/server";
import { redirect } from "next/navigation";
import UserProfileManagement from "@/components/user-profile-management";
import DashboardNavbar from "@/components/dashboard-navbar";
import { getUserProfile } from "@/utils/auth";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user profile
  const userProfile = await getUserProfile(user.id);

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <UserProfileManagement user={user} userProfile={userProfile} />
        </div>
      </div>
    </>
  );
}
