import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-blue-800">Privacy Policy</h1>
        <p className="mb-6 text-gray-700">
          Your privacy is important to us. This Privacy Policy explains how Pegasus collects, uses, and protects your information.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4 text-gray-700">
          We collect information you provide when you sign up, use our services, or contact support. This may include your name, email, social profiles, and payment information.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Information</h2>
        <p className="mb-4 text-gray-700">
          We use your information to provide and improve Pegasus, process payments, communicate with you, and ensure platform security.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Sharing</h2>
        <p className="mb-4 text-gray-700">
          We do not sell your personal information. We may share data with trusted partners for payment processing, analytics, or legal compliance.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies & Tracking</h2>
        <p className="mb-4 text-gray-700">
          Pegasus uses cookies and similar technologies to enhance your experience and analyze usage. You can control cookies in your browser settings.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
        <p className="mb-4 text-gray-700">
          We implement industry-standard security measures to protect your data. However, no system is 100% secure.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
        <p className="mb-4 text-gray-700">
          You may access, update, or delete your information at any time. Contact us for assistance.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Policy</h2>
        <p className="mb-4 text-gray-700">
          We may update this Privacy Policy from time to time. Continued use of Pegasus constitutes acceptance of the new policy.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
        <p className="mb-4 text-gray-700">
          If you have any questions about this policy, please contact us at privacy@thepegasus.ca.
        </p>
      </main>
      <Footer />
    </div>
  );
} 