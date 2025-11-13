import { LegalPageLayout } from "@/components/legal-page-layout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="November 12, 2025">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to RAG Agent Chat (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your
          personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our web application and services.
        </p>
        <p className="mb-4">
          By using our service, you agree to the collection and use of information in accordance with this policy. If
          you do not agree with our policies and practices, please do not use our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

        <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
        <p className="mb-4">
          When you create an account using Google OAuth, we collect:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your Google profile picture</li>
          <li>Unique identifier from your Google account</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">2.2 Usage Information</h3>
        <p className="mb-4">
          We automatically collect information about how you use our service, including:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Conversation history with AI agents</li>
          <li>Questions asked and responses received</li>
          <li>Agents you interact with</li>
          <li>Timestamps of your interactions</li>
          <li>Feature usage patterns</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">2.3 Technical Information</h3>
        <p className="mb-4">
          We collect technical data to improve our service:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>Operating system</li>
          <li>Referring URLs</li>
          <li>Pages visited and time spent</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect for the following purposes:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Provide Services:</strong> To create and manage your account, enable chat functionality, and deliver AI-powered responses</li>
          <li><strong>Improve Services:</strong> To analyze usage patterns, optimize performance, and develop new features</li>
          <li><strong>Communication:</strong> To send you service updates, security alerts, and support messages</li>
          <li><strong>Security:</strong> To detect, prevent, and address fraud, abuse, and security issues</li>
          <li><strong>Personalization:</strong> To customize your experience and remember your preferences</li>
          <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. How We Store Your Information</h2>

        <h3 className="text-xl font-semibold mb-3">4.1 Data Storage</h3>
        <p className="mb-4">
          Your data is stored securely using industry-standard encryption:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>All data is encrypted in transit using TLS/SSL</li>
          <li>Sensitive data is encrypted at rest</li>
          <li>We use secure PostgreSQL databases hosted in trusted data centers</li>
          <li>Access to your data is restricted to authorized personnel only</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">4.2 Data Retention</h3>
        <p className="mb-4">
          We retain your information for as long as necessary to provide our services:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Account information is retained while your account is active</li>
          <li>Conversation history is retained indefinitely unless you request deletion</li>
          <li>Technical logs are retained for 90 days</li>
          <li>Deleted data is permanently removed within 30 days</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Sharing Your Information</h2>
        <p className="mb-4">
          We do not sell your personal information. We may share your information in the following circumstances:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Service Providers:</strong> With third-party vendors who help us operate our service (e.g., hosting providers, AI model providers)</li>
          <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
        </ul>
        <p className="mb-4">
          All third-party service providers are bound by data protection agreements and cannot use your data for their own purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
        <p className="mb-4">
          You have the following rights regarding your personal information:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information (right to be forgotten)</li>
          <li><strong>Export:</strong> Request a machine-readable copy of your data (data portability)</li>
          <li><strong>Opt-Out:</strong> Opt out of marketing communications</li>
          <li><strong>Restrict Processing:</strong> Request restriction of how we process your data</li>
        </ul>
        <p className="mb-4">
          To exercise these rights, please contact us using the information provided at the end of this policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
        <p className="mb-4">
          We use cookies and similar tracking technologies to enhance your experience:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality</li>
          <li><strong>Preference Cookies:</strong> Remember your settings (e.g., dark mode)</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
        </ul>
        <p className="mb-4">
          For more details, please see our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Children&apos;s Privacy</h2>
        <p className="mb-4">
          Our service is not intended for users under the age of 13. We do not knowingly collect personal information
          from children. If you believe we have collected information from a child, please contact us immediately, and
          we will take steps to delete such information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
        <p className="mb-4">
          Your information may be transferred to and processed in countries other than your country of residence. These
          countries may have different data protection laws. We ensure appropriate safeguards are in place to protect
          your information in accordance with this Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Security Measures</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your information:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Access controls and authentication requirements</li>
          <li>Employee training on data protection</li>
          <li>Incident response procedures</li>
        </ul>
        <p className="mb-4">
          However, no method of transmission over the internet is 100% secure. While we strive to protect your
          information, we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of material changes by:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Updating the &quot;Last Updated&quot; date at the top of this policy</li>
          <li>Sending you an email notification</li>
          <li>Displaying a prominent notice on our website</li>
        </ul>
        <p className="mb-4">
          Your continued use of our service after changes constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
        <p className="mb-4">
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="mb-2"><strong>Email:</strong> privacy@ragagentchat.com</p>
          <p className="mb-2"><strong>Address:</strong> [Your Company Address]</p>
          <p><strong>Response Time:</strong> We aim to respond within 48 hours</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
