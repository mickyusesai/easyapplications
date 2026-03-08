import Logo from "./Logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo className="w-7 h-7 rounded-lg" />
            <span className="font-semibold">
              <span className="text-white">Easy</span>
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #3C3CE6 0%, #66C7FF 100%)" }}
              >
                Applications
              </span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a href="mailto:micky@easyreimburse.ai" className="hover:text-white transition-colors">
              micky@easyreimburse.ai
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} EasyApplications.</p>
        </div>
      </div>
    </footer>
  );
}
