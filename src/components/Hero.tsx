export default function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
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

      <div className="relative z-1 max-w-4xl mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/90 text-sm font-medium">
            AI-Powered Feedback in Minutes
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Get Expert Feedback on Your{" "}
          <span className="text-white/90">Erasmus+ Applications</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop waiting months for national agency feedback. Upload your Youth Exchange
          or Training Course application and receive a detailed evaluation report
          in minutes — not months.
        </p>

        <a
          href="#upload"
          className="inline-flex items-center gap-2 bg-white text-brand-dark font-semibold px-8 py-4 rounded-full hover:bg-white/90 transition-all hover:scale-105 shadow-lg shadow-black/10"
        >
          Evaluate My Application
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
