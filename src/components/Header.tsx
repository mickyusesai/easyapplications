import Logo from "./Logo";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="w-9 h-9 rounded-xl" />
          <span className="text-xl font-semibold tracking-tight">
            <span className="text-white">Easy</span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #3C3CE6 0%, #66C7FF 100%)" }}
            >
              Applications
            </span>
          </span>
        </div>
        <a
          href="#features"
          className="text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          How It Works
        </a>
      </div>
    </header>
  );
}
