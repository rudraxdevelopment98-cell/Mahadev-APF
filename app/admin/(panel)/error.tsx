"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-red-400/30 bg-red-400/5 p-8 text-center">
      <h1 className="font-heading text-2xl font-bold text-paper">
        This page hit an error
      </h1>
      <p className="mt-2 text-sm text-muted">
        Something went wrong loading this screen. Try again, or go back to the
        dashboard.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft"
        >
          Try again
        </button>
        <Link
          href="/admin"
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-paper hover:border-gold hover:text-gold"
        >
          Dashboard
        </Link>
      </div>
      {error.digest && (
        <p className="mt-5 text-xs text-muted/60">Reference: {error.digest}</p>
      )}
    </div>
  );
}
