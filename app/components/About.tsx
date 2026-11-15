import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import BassSynth from "./BassSynth";
import { profile, education } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-[var(--max-w)] px-5 py-20">
      <SectionHeading index="01" command="cat about.md" title="About" />

      <Reveal className="space-y-5 font-sans text-[15px] leading-relaxed text-fg-muted sm:text-base">
        {profile.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </Reveal>

      <Reveal delay={120} className="mt-8 space-y-5">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-dim">
          education
        </p>
        {education.map((ed, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 border-l-2 border-accent/40 pl-4 font-mono text-sm"
          >
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-fg">{ed.school}</span>
              {ed.current && (
                <span className="rounded-full bg-accent-dim px-2 py-0.5 text-[11px] text-accent">
                  current
                </span>
              )}
            </span>
            <span className="text-fg-muted">{ed.program}</span>
            <span className="text-fg-dim">{ed.period}</span>
          </div>
        ))}
      </Reveal>

      <Reveal
        delay={120}
        className="mt-10 space-y-4 font-sans text-[15px] leading-relaxed text-fg-muted sm:text-base"
      >
        <p>
          Outside work I&apos;m part gym rat, part bass head. A normal Monday
          morning is chest press with the 60-65 lb dumbbells, here and there -
          chasing heavier, chasing bigger, one rep at a time. 💪
        </p>
        <p>
          And since I&apos;m always buried in dubstep, I figured I&apos;d just
          synthesize some in code. Hit play for a wobble bass generated live in
          your browser - no audio file involved:
        </p>
      </Reveal>

      <BassSynth />
    </section>
  );
}
