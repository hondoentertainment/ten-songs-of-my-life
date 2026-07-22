"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Board" },
  { href: "/create", label: "Make yours" },
  { href: "/my-nine", label: "My Nine" },
  { href: "/saved", label: "Saved" },
  { href: "/stats", label: "Stats" },
];

export function SiteNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/embed")) return null;

  return (
    <nav
      aria-label="Primary"
      className="mb-5 flex items-center gap-1 overflow-x-auto category-rail border-b border-paper/10 pb-3"
    >
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition ${
              active
                ? "bg-paper text-ink"
                : "text-paper/50 hover:text-paper"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
