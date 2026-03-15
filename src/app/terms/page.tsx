import Link from "next/link";
import { ContentPageLayout } from "@/components/pages/ContentPageLayout";

export const metadata = {
  title: "Terms of Service | Canadian Citizenship Test Prep",
  description:
    "Terms of service for using the Canadian Citizenship Test Prep website and its study tools.",
};

export default function TermsPage() {
  return (
    <ContentPageLayout title="Terms of Service" subtitle="Last updated: March 2026">
      <p>By using this website and its services, you agree to the following terms.</p>

      <h2>Purpose of the Website</h2>
      <p>
        This website provides <strong>educational study tools and practice materials</strong> to
        help users prepare for the Canadian citizenship exam.
      </p>
      <p>
        The content is intended as a <strong>study aid only</strong> and does not guarantee success
        on the official citizenship test.
      </p>

      <h2>Study Materials</h2>
      <p>Some study questions and information are based on the official study guide:</p>
      <p>
        <strong>Discover Canada: The Rights and Responsibilities of Citizenship</strong>
      </p>
      <p>
        The practice questions provided on this website are designed to help users review and
        understand the material contained in the official guide.
      </p>

      <h2>Subscriptions and Payments</h2>
      <p>Access to certain features may require a paid subscription.</p>
      <p>
        Payments are securely processed through <strong>Stripe</strong>. By purchasing a subscription,
        you agree to the payment terms displayed at checkout.
      </p>
      <p>Subscriptions may renew automatically unless canceled.</p>

      <h2>Refunds</h2>
      <p>
        Because this service provides <strong>immediate access to digital educational content</strong>
        , refunds may not always be possible after access has been granted. However, reasonable
        requests may be reviewed on a case-by-case basis.
      </p>

      <h2>Website Availability</h2>
      <p>
        While efforts are made to keep the website running smoothly, the service may occasionally
        experience downtime due to maintenance, updates, or technical issues.
      </p>

      <h2>Errors and Improvements</h2>
      <p>
        This website is a personal project and may occasionally contain errors in questions, answers,
        or functionality. Users are encouraged to report any issues so they can be corrected.
      </p>
      <p>The website will continue to evolve and improve over time.</p>

      <h2>Acceptable Use</h2>
      <p>Users agree not to:</p>
      <ul>
        <li>Attempt to copy or redistribute website content for commercial purposes</li>
        <li>Attempt to hack, disrupt, or interfere with the website</li>
        <li>Use automated tools to scrape or extract large amounts of content</li>
      </ul>

      <h2>Changes to Terms</h2>
      <p>
        These terms may be updated as the website grows. Continued use of the website indicates
        acceptance of any revised terms.
      </p>

      <h2>Contact</h2>
      <p>
        For questions regarding these terms, please{" "}
        <Link href="/contact" className="text-primary hover:underline">
          contact the website administrator
        </Link>{" "}
        through the website&apos;s contact page.
      </p>
    </ContentPageLayout>
  );
}
