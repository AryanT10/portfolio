"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { socials, profile } from "@/lib/content";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(socials.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section id="contact" className="mx-auto max-w-[var(--max-w)] px-5 py-20">
      <SectionHeading index="05" command="./contact.sh" title="Get in touch" />

      <Reveal>
        <div className="overflow-hidden rounded-xl border border-border-strong bg-bg-raised">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-term-red" />
            <span className="h-3 w-3 rounded-full bg-term-yellow" />
            <span className="h-3 w-3 rounded-full bg-term-green" />
          </div>
          <div className="space-y-4 p-6 font-mono text-sm sm:p-8">
            <p className="text-fg-muted">
              <span className="text-accent">$</span> echo &quot;{profile.status}&quot;
            </p>
            <p className="leading-relaxed text-fg">
              Have a role, a project, or a good bug story? I&apos;d love to hear
              it. Fastest way to reach me:
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`mailto:${socials.email}`}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold break-all text-bg transition hover:bg-accent-hover"
              >
                {socials.email}
              </a>
              <button
                onClick={copy}
                className="rounded-lg border border-border-strong px-3 py-2.5 text-sm text-fg-muted transition hover:border-accent hover:text-accent"
              >
                {copied ? "✓ copied" : "copy"}
              </button>
            </div>

            <div className="flex flex-wrap gap-5 border-t border-border pt-5 text-sm">
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="link-accent"
              >
                ↗ GitHub
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="link-accent"
              >
                ↗ LinkedIn
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
