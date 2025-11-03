import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/contactus" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Contact Us</Link>
          <Link href="/others" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Others</Link>
        </div>
      </div>
    </nav>
  );
}
