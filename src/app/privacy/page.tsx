import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - EasyApplications",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-20 px-6">
        <article className="max-w-3xl mx-auto prose prose-gray">
          <h1 className="text-3xl font-bold text-brand-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-500 mb-10">Last updated: March 8, 2026</p>

          <section className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-brand-900 mt-8 mb-3">
                1. Who We Are
              </h2>
              <p>
                EasyApplications (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
                provides an AI-powered evaluation service for Erasmus+ project
                applications. You can reach us at{" "}
                <a
                  href="mailto:contact@easyapplications.ai"
                  className="text-brand-600 underline"
                >
                  contact@easyapplications.ai
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-brand-900 mt-8 mb-3">
                2. Data We Collect
              </h2>
              <p>When you use our service, we collect and process:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <strong>Email address</strong> &mdash; to deliver your
                  evaluation report.
                </li>
                <li>
                  <strong>Uploaded document</strong> &mdash; the Erasmus+
                  application you submit for evaluation. Documents are stored
                  securely in our cloud storage (Cloudflare R2).
                </li>
                <li>
                  <strong>Payment information</strong> &mdash; processed
                  securely by Stripe. We do not store your card details.
                </li>
                <li>
                  <strong>Project type selection</strong> &mdash; whether your
                  application is for a Youth Exchange or Training Course.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-brand-900 mt-8 mb-3">
                3. How We Use Your Data
              </h2>
              <p>We use your data to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Generate your AI-powered evaluation report using Anthropic&apos;s
                  Claude AI.
                </li>
                <li>Deliver the evaluation report to your email via Postmark.</li>
                <li>Process your payment through Stripe.</li>
                <li>
                  Improve our services, including training and refining our AI
                  evaluation models in the future.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-brand-900 mt-8 mb-3">
                4. Document Storage &amp; Retention
              </h2>
              <p>
                Uploaded documents are stored securely on Cloudflare R2 object
                storage. We retain your uploaded documents to improve our
                services, including the development of AI-based application
                writing tools. Documents are stored in encrypted form and access
                is strictly limited.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-brand-900 mt-8 mb-3">
                5. Third-Party Services
              </h2>
              <p>We use the following third-party services to operate:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <strong>Stripe</strong> &mdash; payment processing (
                  <a
                    href="https://stripe.com/privacy"
                    className="text-brand-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Stripe Privacy Policy
                  </a>
                  ).
                </li>
                <li>
                  <strong>Anthropic (Claude AI)</strong> &mdash; document
                  evaluation (
                  <a
                    href="https://www.anthropic.com/privacy"
                    className="text-brand-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Anthropic Privacy Policy
                  </a>
                  ).
                </li>
                <li>
                  <strong>Postmark</strong> &mdash; email delivery.
                </li>
                <li>
                  <strong>Cloudflare R2</strong> &mdash; secure document storage.
                </li>
                <li>
                  <strong>Railway</strong> &mdash; application hosting.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-brand-900 mt-8 mb-3">
                6. Your Rights
              </h2>
              <p>
                Under the GDPR, you have the right to access, correct, or
                delete your personal data. You may also request a copy of your
                data or object to its processing. To exercise any of these
                rights, contact us at{" "}
                <a
                  href="mailto:contact@easyapplications.ai"
                  className="text-brand-600 underline"
                >
                  contact@easyapplications.ai
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-brand-900 mt-8 mb-3">
                7. Cookies
              </h2>
              <p>
                We do not use tracking cookies or analytics. Only essential
                cookies required for the payment process (set by Stripe) may be
                used.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-brand-900 mt-8 mb-3">
                8. Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. Changes
                will be posted on this page with an updated date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-brand-900 mt-8 mb-3">
                9. Contact
              </h2>
              <p>
                For any questions about this privacy policy or your data, email
                us at{" "}
                <a
                  href="mailto:contact@easyapplications.ai"
                  className="text-brand-600 underline"
                >
                  contact@easyapplications.ai
                </a>
                .
              </p>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
