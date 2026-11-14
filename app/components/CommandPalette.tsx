"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCommands, filterCommands } from "./useCommands";

export default function CommandPalette() {
  const commands = useCommands();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const filtered = useMemo(
    () => filterCommands(commands, query),
    [commands, query]
  );

  const runAt = useCallback(
    (i: number) => {
      const cmd = filtered[i];
      if (!cmd) return;
      cmd.run();
      close();
    },
    [filtered, close]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen as EventListener);
    };
  }, [close]);

  useEffect(() => {
    if (open) {
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(active);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border-strong bg-bg-raised shadow-2xl shadow-black/60">
        <div className="flex items-center gap-2 border-b border-border px-4">
          <span className="font-mono text-accent">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search…"
            className="w-full bg-transparent py-4 font-mono text-sm text-fg outline-none focus:outline-none focus-visible:outline-none placeholder:text-fg-dim"
            aria-label="Command input"
          />
          <kbd className="rounded border border-border bg-bg-overlay px-1.5 py-0.5 font-mono text-[10px] text-fg-dim">
            esc
          </kbd>
        </div>

        <ul className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center font-mono text-sm text-fg-dim">
              no matches
            </li>
          )}
          {filtered.map((c, i) => (
            <li key={c.id}>
              <button
                onMouseMove={() => setActive(i)}
                onClick={() => runAt(i)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-mono text-sm transition-colors ${
                  i === active
                    ? "bg-accent-dim text-fg"
                    : "text-fg-muted hover:bg-bg-overlay"
                }`}
              >
                <span>
                  <span className={i === active ? "text-accent" : "text-fg-dim"}>
                    /
                  </span>
                  {c.label}
                  <span className="ml-3 text-fg-dim">{c.desc}</span>
                </span>
                <span className="text-[11px] text-fg-dim">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
