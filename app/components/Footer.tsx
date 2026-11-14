import { profile, socials } from "@/lib/content";

const YEAR = 2026;

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[var(--max-w)] px-5 py-12">
      <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-8 font-mono text-xs text-fg-dim sm:flex-row sm:items-center">
        <p>
          <span className="text-accent">$</span> built from scratch · Next.js +
          Tailwind · {YEAR}
        </p>
        <div className="flex gap-4">
          <a href={socials.github} target="_blank" rel="noreferrer" className="transition hover:text-accent">
            github
          </a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="transition hover:text-accent">
            linkedin
          </a>
          <a href="#top" className="transition hover:text-accent">
            ↑ top
          </a>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] text-fg-dim/70">
        <span># psst, try this anywhere:</span>
        <span className="flex flex-wrap items-center gap-1">
          {["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"].map((k, i) => (
            <kbd
              key={i}
              className="rounded border border-border-strong bg-bg-overlay px-1.5 py-0.5 text-fg-muted"
            >
              {k}
            </kbd>
          ))}
        </span>
      </div>

      <p className="mt-6 font-mono text-[11px] text-fg-dim/70">
        © {YEAR} {profile.name}.
      </p>
    </footer>
  );
}
