import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main>
      <Header />
      <section
        className="relative overflow-hidden min-h-[60vh] flex items-center"
        style={{
          background: "linear-gradient(135deg, #3C3CE6 0%, #66C7FF 100%)",
        }}
      >
        <div className="relative z-1 max-w-2xl mx-auto px-6 py-28 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-10 md:p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Payment Received — Evaluation Started
            </h1>
            <p className="text-gray-600 mb-3 leading-relaxed">
              Your application is now being evaluated against real National
              Agency criteria. You&apos;ll receive a detailed PDF evaluation
              report by email within approximately 10 minutes.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Check your inbox (and spam folder, just in case).
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #3C3CE6 0%, #66C7FF 100%)",
              }}
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
