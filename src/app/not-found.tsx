import Link from "next/link";

export default function NotFound() {
  return (
    <main className="hero-wash flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-soft/90">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl text-paper">Square not found</h1>
      <p className="mt-3 max-w-sm text-sm text-paper/50">
        That mood isn’t on the board.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to the nine
      </Link>
    </main>
  );
}
