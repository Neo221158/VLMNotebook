import { LegalPageLayout } from "@/components/legal-page-layout";

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="November 12, 2025">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
        <p className="mb-4">
          Cookies are small text files that are placed on your computer or mobile device when you visit a website.
          They are widely used to make websites work more efficiently, provide a better user experience, and provide
          information to website owners.
        </p>
        <p className="mb-4">
          Cookies can be &quot;persistent&quot; or &quot;session&quot; cookies:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>
            <strong>Persistent cookies:</strong> Remain on your device for a set period of time or until you delete them
          </li>
          <li>
            <strong>Session cookies:</strong> Are temporary and are deleted when you close your browser
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
        <p className="mb-4">
          RAG Agent Chat uses cookies to enhance your experience, provide functionality, and improve our service.
          We categorize our cookies as follows:
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Essential Cookies</h3>
        <p className="mb-4">
          These cookies are necessary for the website to function and cannot be switched off. They are usually set in
          response to actions you take, such as signing in or setting preferences.
        </p>
        <div className="bg-muted p-4 rounded-lg mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Cookie Name</th>
                <th className="text-left py-2 pr-4">Purpose</th>
                <th className="text-left py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">auth_session</td>
                <td className="py-2 pr-4">Maintains your authentication session</td>
                <td className="py-2">7 days</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">csrf_token</td>
                <td className="py-2 pr-4">Protects against cross-site request forgery attacks</td>
                <td className="py-2">Session</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">cookie_consent</td>
                <td className="py-2 pr-4">Remembers your cookie preferences</td>
                <td className="py-2">1 year</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Preference Cookies</h3>
        <p className="mb-4">
          These cookies allow the website to remember choices you make (such as your theme preference) and provide
          enhanced, more personalized features.
        </p>
        <div className="bg-muted p-4 rounded-lg mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Cookie Name</th>
                <th className="text-left py-2 pr-4">Purpose</th>
                <th className="text-left py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">theme_preference</td>
                <td className="py-2 pr-4">Remembers your light/dark mode preference</td>
                <td className="py-2">1 year</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">language</td>
                <td className="py-2 pr-4">Stores your language preference</td>
                <td className="py-2">1 year</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Analytics Cookies</h3>
        <p className="mb-4">
          These cookies help us understand how visitors interact with our website by collecting and reporting
          information anonymously. This helps us improve the website and user experience.
        </p>
        <div className="bg-muted p-4 rounded-lg mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Cookie Name</th>
                <th className="text-left py-2 pr-4">Purpose</th>
                <th className="text-left py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">_ga</td>
                <td className="py-2 pr-4">Google Analytics - Distinguishes unique users</td>
                <td className="py-2">2 years</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">_gid</td>
                <td className="py-2 pr-4">Google Analytics - Distinguishes unique users</td>
                <td className="py-2">24 hours</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">_gat</td>
                <td className="py-2 pr-4">Google Analytics - Throttles request rate</td>
                <td className="py-2">1 minute</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mb-3 mt-6">2.4 Performance Cookies</h3>
        <p className="mb-4">
          These cookies collect information about how you use our website to help us improve performance and
          user experience.
        </p>
        <div className="bg-muted p-4 rounded-lg mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Cookie Name</th>
                <th className="text-left py-2 pr-4">Purpose</th>
                <th className="text-left py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-4 font-mono">performance_monitoring</td>
                <td className="py-2 pr-4">Monitors page load times and performance metrics</td>
                <td className="py-2">30 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
        <p className="mb-4">
          In addition to our own cookies, we use third-party cookies from the following services:
        </p>

        <h3 className="text-xl font-semibold mb-3">3.1 Google Analytics</h3>
        <p className="mb-4">
          We use Google Analytics to analyze website usage. Google Analytics uses cookies to collect information
          about how visitors use our site. This information is used to compile reports and help us improve the site.
          The cookies collect information in an anonymous form.
        </p>
        <p className="mb-4">
          For more information about Google Analytics cookies, visit the{" "}
          <a
            href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Analytics Cookie Usage documentation
          </a>
          .
        </p>

        <h3 className="text-xl font-semibold mb-3">3.2 Google OAuth</h3>
        <p className="mb-4">
          When you sign in using Google, Google sets cookies to maintain your authentication session. These cookies
          are governed by Google&apos;s privacy policy.
        </p>
        <p className="mb-4">
          For more information, see{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google&apos;s Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. How to Manage Cookies</h2>

        <h3 className="text-xl font-semibold mb-3">4.1 Browser Settings</h3>
        <p className="mb-4">
          Most web browsers allow you to control cookies through their settings preferences. You can set your browser to:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Accept all cookies</li>
          <li>Reject all cookies</li>
          <li>Notify you when a cookie is set</li>
          <li>Delete cookies automatically when you close your browser</li>
        </ul>

        <p className="mb-4">
          To manage cookies in your browser:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>
            <strong>Chrome:</strong>{" "}
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Cookie settings in Chrome
            </a>
          </li>
          <li>
            <strong>Firefox:</strong>{" "}
            <a
              href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Cookie settings in Firefox
            </a>
          </li>
          <li>
            <strong>Safari:</strong>{" "}
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Cookie settings in Safari
            </a>
          </li>
          <li>
            <strong>Edge:</strong>{" "}
            <a
              href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Cookie settings in Edge
            </a>
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">4.2 Opt-Out Tools</h3>
        <p className="mb-4">
          You can opt out of Google Analytics tracking using the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>

        <h3 className="text-xl font-semibold mb-3">4.3 Impact of Blocking Cookies</h3>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 p-4 rounded-lg mb-4">
          <p className="font-semibold mb-2">Important Notice:</p>
          <p className="mb-2">
            If you choose to block or delete cookies, some features of our website may not function properly:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You may not be able to sign in or stay signed in</li>
            <li>Your preferences (like dark mode) will not be saved</li>
            <li>Some interactive features may not work</li>
            <li>You may see less relevant content</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Do Not Track Signals</h2>
        <p className="mb-4">
          Some browsers include a &quot;Do Not Track&quot; (DNT) feature that signals to websites that you do not want to be
          tracked. Currently, there is no industry standard for how websites should respond to DNT signals.
        </p>
        <p className="mb-4">
          At this time, we do not respond to DNT signals. However, you can manage cookies through your browser
          settings as described above.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
        <p className="mb-4">
          We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our
          practices. When we make changes, we will:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Update the &quot;Last Updated&quot; date at the top of this policy</li>
          <li>Notify you if the changes are significant</li>
          <li>Obtain your consent if required by law</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. More Information</h2>
        <p className="mb-4">
          For more information about our privacy practices, please read our{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
        <p className="mb-4">
          If you have questions about our use of cookies, please contact us:
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="mb-2">
            <strong>Email:</strong> privacy@ragagentchat.com
          </p>
          <p className="mb-2">
            <strong>Address:</strong> [Your Company Address]
          </p>
          <p>
            <strong>Response Time:</strong> We aim to respond within 48 hours
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
