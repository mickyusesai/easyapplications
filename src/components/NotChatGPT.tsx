const chatGptItems = [
  "Generic writing tips and grammar fixes",
  "No knowledge of Erasmus+ evaluation criteria",
  "Response in 30 seconds — no deep analysis",
  "No score, no structure, no actionable roadmap",
];

const easyAppItems = [
  {
    label: "Criterion-by-criterion scoring",
    description:
      "Evaluates the criteria that real National Agency evaluators use, with a predicted score for each.",
  },
  {
    label: "5+ minutes of deep AI analysis",
    description:
      "Not a quick autocomplete. The AI spends a minimum of 5 minutes thinking through your application section by section.",
  },
  {
    label: "Trained on real evaluation patterns",
    description:
      "Built on patterns from actual successful and rejected applications and calibrated against real National Agency feedback.",
  },
  {
    label: "Structured report, not a chat reply",
    description:
      "You receive a report with section scores, prioritised weaknesses, and specific improvement suggestions — the same structure as real NA feedback.",
  },
];

export default function NotChatGPT() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider text-center mb-3">
          Why not just use ChatGPT?
        </p>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-14 max-w-2xl mx-auto">
          Because generic AI doesn&apos;t know how Erasmus+ applications are
          evaluated
        </h2>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: ChatGPT card */}
          <div className="rounded-2xl p-8 border-2 border-dashed border-gray-200 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-400">
                Pasting into ChatGPT
              </h3>
            </div>
            <ul className="space-y-4">
              {chatGptItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-gray-300 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: EasyApplications card */}
          <div className="relative rounded-2xl p-8 bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{
                background:
                  "linear-gradient(135deg, #3C3CE6 0%, #66C7FF 100%)",
              }}
            />
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #3C3CE6 0%, #66C7FF 100%)",
                }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                EasyApplications
              </h3>
            </div>
            <ul className="space-y-5">
              {easyAppItems.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
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
                  <div>
                    <span className="font-semibold text-gray-900">
                      {item.label}
                    </span>
                    <span className="text-gray-500"> — {item.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Credibility strip */}
        <div className="mt-12 rounded-xl bg-brand-50 px-8 py-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          <svg
            className="w-6 h-6 text-brand-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <p className="text-gray-700">
            <span className="font-semibold">
              Calibrated against real National Agency feedback.
            </span>{" "}
            Our scoring was validated by comparing AI evaluations against actual
            NA assessment reports — so the scores you receive are realistic, not
            inflated.
          </p>
        </div>
      </div>
    </section>
  );
}
