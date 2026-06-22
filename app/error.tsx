"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Friendly fallback for any unexpected error in a route segment, so visitors
 * never see Next.js's raw "Server Components render" message.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real error in the server/browser logs for debugging.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-gold/50 font-heading text-2xl font-bold text-gold">
        M
      </div>
      <h1 className="font-heading text-3xl font-bold text-paper">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Sorry — that page hit a snag. Please try again. If it keeps happening,
        give us a call and we&apos;ll sort it out.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-paper hover:border-gold hover:text-gold"
        >
          Go home
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-muted/60">Reference: {error.digest}</p>
      )}
    </main>
  );
}
