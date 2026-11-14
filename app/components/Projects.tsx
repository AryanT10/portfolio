import Image from "next/image";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { projects, socials } from "@/lib/content";

export default function Projects() {
  return (
    <section id="work" className="mx-auto max-w-[var(--max-w)] px-5 py-20">
      <SectionHeading index="03" command="ls ~/work" title="Projects" />

      <Reveal className="-mt-4 mb-8 font-sans text-sm leading-relaxed text-fg-muted">
        Personal products I&apos;m actively building - both private while in
        development. Happy to give a live walkthrough.
      </Reveal>

      <div className="space-y-6">
        {projects.map((p, i) => (
          <Reveal as="article" delay={i * 90} key={p.id}>
            <div className="group overflow-hidden rounded-xl border border-border bg-bg-raised transition-colors hover:border-border-strong">
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:p-7">
                {/* icon */}
                {p.icon && (
                  <div className="shrink-0">
                    <Image
                      src={p.icon}
                      alt={`${p.name} icon`}
                      width={56}
                      height={56}
                      className="rounded-xl border border-border"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-mono text-lg font-semibold text-fg">
                      {p.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] ${
                        p.statusTone === "live"
                          ? "bg-accent-dim text-accent"
                          : "border border-border text-fg-dim"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.statusTone === "live" ? "bg-accent" : "bg-fg-dim"
                        }`}
                      />
                      {p.status}
                    </span>
                  </div>

                  <p className="mt-1.5 font-mono text-sm text-fg-muted">
                    {p.tagline}
                  </p>

                  <p className="mt-4 font-sans text-sm leading-relaxed text-fg-muted">
                    {p.description}
                  </p>

                  {/* the impressive bit */}
                  <div className="mt-4 rounded-lg border border-border bg-bg p-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                      why it's interesting
                    </p>
                    <p className="mt-1.5 font-sans text-sm leading-relaxed text-fg-muted">
                      {p.highlight}
                    </p>
                  </div>

                  {/* stack */}
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <li
                        key={s}
                        className="rounded border border-border bg-bg px-2 py-1 font-mono text-[11px] text-fg-muted"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>

                  {/* status row */}
                  <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-sm">
                    {p.private && (
                      <span className="inline-flex items-center gap-1.5 text-fg-dim">
                        <span aria-hidden>🔒</span> private · walkthrough on
                        request
                      </span>
                    )}
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="link-accent"
                      >
                        ↗ live demo
                      </a>
                    )}
                  </div>
                </div>

                {/* screenshot */}
                {p.image && (
                  <div className="shrink-0 self-center sm:self-start">
                    <Image
                      src={p.image}
                      alt={`${p.name} screenshot`}
                      width={160}
                      height={160}
                      className="rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8">
        <a
          href={socials.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex font-mono text-sm text-fg-muted transition hover:text-accent"
        >
          <span className="text-accent">$</span>&nbsp; more on GitHub →
        </a>
      </Reveal>
    </section>
  );
}
