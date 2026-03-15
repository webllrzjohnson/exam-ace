import Link from "next/link";
import { ContentPageLayout } from "@/components/pages/ContentPageLayout";

export const metadata = {
  title: "Privacy Policy | Canadian Citizenship Test Prep",
  description:
    "Learn how we collect, use, and protect your information when you use this website.",
};

export default function PrivacyPage() {
  return (
    <ContentPageLayout title="Privacy Policy" subtitle="Last updated: March 2026">
      <p>
        Thank you for using this website. Your privacy is important, and this page explains what
        information may be collected and how it is used.
      </p>

      <h2>Information We Collect</h2>
      <p>When you use this website, we may collect limited information such as:</p>
      <ul>
        <li>Email address (if you create an account)</li>
        <li>Payment information processed securely by Stripe</li>
        <li>Basic usage information such as pages visited or quiz progress</li>
        <li>Technical information like browser type or device</li>
      </ul>
      <p>
        We <strong>do not store credit card information</strong> on this website. All payments are
        securely processed by Stripe.
      </p>

      <h2>How Your Information Is Used</h2>
      <p>The information collected may be used to:</p>
      <ul>
        <li>Provide access to study materials and practice tests</li>
        <li>Manage subscriptions and payments</li>
        <li>Improve the website and fix errors</li>
        <li>Communicate important service updates</li>
      </ul>
      <p>
        Your information will <strong>never be sold or rented to third parties</strong>.
      </p>

      <h2>Cookies</h2>
      <p>
        This website may use basic cookies to improve your experience, remember your login session,
        and help the site function properly.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        Some services used on this website may collect limited information in order to function
        properly. These may include:
      </p>
      <ul>
        <li>Stripe for payment processing</li>
        <li>Hosting providers used to operate the website infrastructure</li>
      </ul>
      <p>Each third-party service has its own privacy policies governing how they handle data.</p>

      <h2>Data Security</h2>
      <p>
        Reasonable technical measures are used to protect your information. However, no internet
        service can guarantee absolute security.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        This privacy policy may be updated occasionally as the website evolves. Continued use of
        the website indicates acceptance of any updates.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this privacy policy, please{" "}
        <Link href="/contact" className="text-primary hover:underline">
          contact the website administrator
        </Link>{" "}
        through the contact page.
      </p>
    </ContentPageLayout>
  );
}
