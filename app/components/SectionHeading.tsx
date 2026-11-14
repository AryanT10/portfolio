import Reveal from "./Reveal";

export default function SectionHeading({
  command,
  title,
  index,
}: {
  command: string;
  title: string;
  index: string;
}) {
  return (
    <Reveal className="mb-10">
      <div className="flex items-baseline gap-3 text-sm text-fg-dim">
        <span aria-hidden className="text-accent font-semibold">
          {index}
        </span>
        <p className="font-mono">
          <span className="text-accent">$</span> {command}
        </p>
      </div>
      <h2 className="mt-3 font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
        {title}
      </h2>
    </Reveal>
  );
}
