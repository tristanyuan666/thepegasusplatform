import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-blue-800">Terms of Service</h1>
        <p className="mb-6 text-gray-700">
          Welcome to Pegasus! By using our platform, you agree to the following terms and conditions. Please read them carefully.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4 text-gray-700">
          By accessing or using Pegasus, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our platform.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
        <p className="mb-4 text-gray-700">
          You are responsible for maintaining the confidentiality of your account and password. You agree to provide accurate information and notify us of any unauthorized use of your account.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Use of the Service</h2>
        <p className="mb-4 text-gray-700">
          You may use Pegasus only for lawful purposes. You may not use our platform to violate any laws, infringe on intellectual property, or harm others.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Subscription & Payments</h2>
        <p className="mb-4 text-gray-700">
          By subscribing to a paid plan, you agree to pay all applicable fees. Subscriptions renew automatically unless cancelled. Refunds are subject to our refund policy.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Termination</h2>
        <p className="mb-4 text-gray-700">
          We reserve the right to suspend or terminate your account at our discretion, with or without notice, for any violation of these terms.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Terms</h2>
        <p className="mb-4 text-gray-700">
          We may update these Terms of Service from time to time. Continued use of Pegasus constitutes acceptance of the new terms.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
        <p className="mb-4 text-gray-700">
          If you have any questions about these terms, please contact us at support@thepegasus.ca.
        </p>
      </main>
      <Footer />
    </div>
  );
} 