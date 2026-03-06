import UploadSection from "./UploadSection";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #3C3CE6 0%, #66C7FF 100%)",
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-white/3" />
      </div>

      <div className="relative z-1 max-w-7xl mx-auto px-6 pt-28 pb-16 md:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                AI-Powered Feedback in Minutes
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Get Expert Feedback on Your{" "}
              <span className="text-white/90">Erasmus+ Applications</span>
            </h1>

            <p className="text-lg text-white/80 max-w-xl mb-8 leading-relaxed">
              Stop waiting months for national agency feedback. Upload your
              Youth Exchange or Training Course application and receive a
              detailed evaluation report in minutes — not months.
            </p>

            <div className="hidden lg:flex items-center gap-6 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                PDF &amp; DOCX supported
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Report via email
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                ~10 min turnaround
              </div>
            </div>
          </div>

          {/* Right: Upload form */}
          <div className="w-full lg:w-[480px] shrink-0">
            <UploadSection />
          </div>
        </div>
      </div>
    </section>
  );
}
