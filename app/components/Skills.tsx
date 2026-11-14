import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { skills } from "@/lib/content";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-[var(--max-w)] px-5 py-20">
      <SectionHeading index="04" command="cat skills.json" title="Toolbox" />

      <Reveal>
        <div className="rounded-xl border border-border bg-bg-raised p-5 font-mono text-sm sm:p-7">
          {skills.map((grp, i) => (
            <div
              key={grp.group}
              className={`flex flex-col gap-2 py-3 sm:flex-row sm:gap-5 ${
                i !== 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="shrink-0 text-fg-dim sm:w-28">
                {grp.group}
                <span className="text-accent">:</span>
              </span>
              <ul className="flex flex-wrap gap-2">
                {grp.items.map((it) => (
                  <li
                    key={it}
                    className="rounded border border-border bg-bg px-2 py-0.5 text-xs text-fg-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
