import Logo from "./Logo";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8" />
          <span className="text-white text-xl font-semibold tracking-tight">
            EasyApplications
          </span>
        </div>
        <a
          href="#upload"
          className="text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          Get Started
        </a>
      </div>
    </header>
  );
}
