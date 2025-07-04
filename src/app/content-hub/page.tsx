import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import ContentCreationHub from "@/components/content-creation-hub";
import DashboardNavbar from "@/components/dashboard-navbar";
import { getUserSubscription, getSubscriptionTier } from "@/utils/auth";

export default async function ContentHubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const userProfile = null; // Optionally fetch if needed
  const subscription = await getUserSubscription(user.id);
  const subscriptionTier = getSubscriptionTier(subscription);
  const hasActiveSubscription = !!(subscription && subscription.status === "active");

  return (
    <>
      <DashboardNavbar />
      <ContentCreationHub
        user={user}
        hasActiveSubscription={hasActiveSubscription}
        subscriptionTier={subscriptionTier}
      />
    </>
  );
}
