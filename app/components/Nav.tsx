"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { profile } from "@/lib/content";

const links = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#work", label: "work" },
  { href: "#contact", label: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[var(--max-w)] items-center justify-between px-5 py-3.5">
        <a
          href="#top"
          className="font-mono text-sm font-semibold text-fg transition hover:text-accent"
        >
          <span className="text-accent">{profile.handle}</span>
          <span className="text-fg-dim">@{profile.host}</span>
        </a>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 sm:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-md px-2.5 py-1.5 font-mono text-sm text-fg-muted transition hover:text-accent"
              >
                {l.label}
              </a>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
