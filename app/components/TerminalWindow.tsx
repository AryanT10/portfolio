import type { ReactNode } from "react";

export default function TerminalWindow({
  title = "bash",
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-border-strong bg-bg-raised shadow-2xl shadow-black/40 ${className}`}
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-term-red" />
        <span className="h-3 w-3 rounded-full bg-term-yellow" />
        <span className="h-3 w-3 rounded-full bg-term-green" />
        <span className="ml-3 font-mono text-xs text-fg-dim select-none">
          {title}
        </span>
      </div>
      <div className="p-5 sm:p-7 font-mono text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
