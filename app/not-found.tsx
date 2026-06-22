import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-gold/50 font-heading text-2xl font-bold text-gold">
        M
      </div>
      <p className="font-heading text-5xl font-bold text-gold">404</p>
      <h1 className="mt-2 font-heading text-2xl font-bold text-paper">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft"
      >
        Go home
      </Link>
    </main>
  );
}
