import Link from "next/link";

export default function NotFound() {
  return (
    <main className="hero-wash flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl text-paper">Pin not found</h1>
      <p className="mt-3 text-paper/60">That mood board isn’t on the wall.</p>
      <Link
        href="/"
        className="mt-8 rounded-sm bg-amber-glow px-5 py-2.5 text-sm font-semibold text-ink"
      >
        Back to the board
      </Link>
    </main>
  );
}
