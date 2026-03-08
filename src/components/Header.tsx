import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="w-9 h-9 rounded-xl" />
          <span className="text-xl font-semibold tracking-tight">
            <span className="text-gray-900">Easy</span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #3C3CE6 0%, #66C7FF 100%)" }}
            >
              Applications
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
