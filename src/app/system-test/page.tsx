import { createClient } from "../../../supabase/server";
import SystemTest from "@/components/system-test";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function SystemTestPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <SystemTest user={user} />
        </div>
      </div>
    </>
  );
}
