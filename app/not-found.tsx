import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-5 text-center">
      {/* Decorative background dots */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0f172a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md">
        {/* Logo */}
        <Image
          src="/smipay-icon.jpg"
          alt="Smipay"
          width={56}
          height={56}
          className="rounded-2xl shadow-sm mb-6"
          priority
        />

        {/* Large 404 */}
        <p className="text-[120px] sm:text-[160px] font-extrabold leading-none tracking-tighter text-slate-200 select-none">
          404
        </p>

        {/* Accent bar */}
        <div className="h-1 w-12 rounded-full bg-[#ea580c] -mt-4 mb-6" />

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mb-8 max-w-[320px] leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#ea580c] text-white text-sm font-semibold hover:bg-[#ea580c]/90 transition-colors shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
