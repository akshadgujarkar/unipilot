import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-2xl font-bold text-slate-100 mb-2">404 — Page Not Found</h2>
      <p className="text-sm text-slate-400 mb-6">
        The requested resource does not exist on UniPilot.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-medium text-white transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

