import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { experience, caseStudies } from "@/lib/content";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-[var(--max-w)] px-5 py-20">
      <SectionHeading
        index="02"
        command="git log --author=aryan"
        title="Experience"
      />

      {/* company header */}
      <Reveal className="mb-10 flex items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <h3 className="font-mono text-xl font-semibold text-fg">
            {experience.company}
          </h3>
          <p className="mt-1 font-mono text-xs text-fg-dim">
            {experience.companyNote}
          </p>
        </div>
        <span className="shrink-0 font-mono text-sm text-accent">
          {experience.totalPeriod}
        </span>
      </Reveal>

      {/* role timeline */}
      <ol className="relative space-y-9 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-border">
        {experience.roles.map((role, i) => (
          <Reveal as="li" delay={i * 80} key={role.period} className="relative pl-7">
            <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-accent bg-bg" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="font-mono text-base font-semibold text-fg">
                {role.title}{" "}
                <span className="font-normal text-fg-dim">· {role.team}</span>
              </h4>
              <span className="font-mono text-xs text-fg-dim">
                {role.period}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-xs text-accent/80">{role.kind}</p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-fg-muted">
              {role.summary}
            </p>
            {role.highlights.length > 0 && (
              <ul className="mt-3 space-y-2">
                {role.highlights.map((h, j) => (
                  <li
                    key={j}
                    className="flex gap-2.5 font-sans text-sm leading-relaxed text-fg-muted"
                  >
                    <span aria-hidden className="mt-[2px] text-accent">
                      ▸
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        ))}
      </ol>

      {/* case studies */}
      <Reveal className="mt-16 mb-6">
        <p className="font-mono text-sm text-fg-dim">
          <span className="text-accent">$</span> ls deep-dives/
        </p>
        <h3 className="mt-2 font-mono text-lg font-semibold text-fg">
          Selected engineering work
        </h3>
      </Reveal>

      <div className="space-y-3">
        {caseStudies.map((cs, i) => (
          <Reveal as="div" delay={i * 60} key={cs.id}>
            <details className="group overflow-hidden rounded-lg border border-border bg-bg-raised transition-colors open:border-border-strong">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:content-['']">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="font-mono text-accent transition-transform duration-200 group-open:rotate-90"
                  >
                    ▸
                  </span>
                  <span className="font-mono text-sm font-medium text-fg">
                    {cs.title}
                  </span>
                </span>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-fg-dim">
                  {cs.team}
                </span>
              </summary>

              <div className="space-y-4 border-t border-border px-5 py-5 font-sans text-sm leading-relaxed">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-fg-dim">
                    problem
                  </p>
                  <p className="mt-1 text-fg-muted">{cs.problem}</p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-fg-dim">
                    approach
                  </p>
                  <p className="mt-1 text-fg-muted">{cs.approach}</p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-accent">
                    impact
                  </p>
                  <p className="mt-1 text-fg">{cs.impact}</p>
                </div>
                <ul className="flex flex-wrap gap-2 pt-1">
                  {cs.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded border border-border bg-bg px-2 py-1 font-mono text-[11px] text-fg-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
