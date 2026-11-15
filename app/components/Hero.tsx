"use client";

import { useEffect, useRef, useState } from "react";
import { profile, socials } from "@/lib/content";
import {
  useCommands,
  filterCommands,
  matchCommand,
  type Command,
} from "./useCommands";

const PROMPT = `${profile.handle}@${profile.host} ~ %`;

const steps = [
  { cmd: "whoami" },
  { cmd: "cat mission.txt" },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

type Line = { kind: "cmd" | "out" | "err"; text: string };

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const commands = useCommands();

  // intro typing
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [introDone, setIntroDone] = useState(false);

  // interactive terminal
  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showSuggest = input.startsWith("/");
  const suggestions: Command[] = showSuggest
    ? filterCommands(commands, input)
    : [];

  useEffect(() => {
    if (reduced) {
      setStep(steps.length);
      setIntroDone(true);
      return;
    }
    let active = true;
    let s = 0;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!active) return;
      if (s >= steps.length) {
        setIntroDone(true);
        return;
      }
      const cmd = steps[s].cmd;
      if (i <= cmd.length) {
        setTyped(cmd.slice(0, i));
        i += 1;
        timer = setTimeout(tick, 75);
      } else {
        s += 1;
        i = 0;
        setStep(s);
        setTyped("");
        timer = setTimeout(tick, 650);
      }
    };
    timer = setTimeout(tick, 650);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [reduced]);

  useEffect(() => {
    setSel(0);
  }, [input]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  const push = (...lines: Line[]) => setHistory((h) => [...h, ...lines]);

  const JOKES = [
    "Why do programmers prefer dark mode? Light attracts bugs. 🐛",
    "A SQL query walks into a bar, sees two tables and asks: may I join you?",
    "There are 10 kinds of people: those who read binary and those who don't.",
    "It works on my machine ¯\\_(ツ)_/¯",
    "To understand recursion, first understand recursion.",
  ];

  // hidden commands - not shown in the dropdown, fun to discover
  const easterEgg = (name: string): string[] | null => {
    if (name.startsWith("sudo")) {
      return name.includes("hire")
        ? ["✓ root access granted → aryantuwar676@gmail.com"]
        : ["nice try - you already have root here 😏"];
    }
    if (name.startsWith("rm")) {
      return ["🙅 denied. this site is immutable & version-controlled. good instinct though."];
    }
    if (name.startsWith("echo ")) return [name.slice(5)];
    if (name === "ls" || name.startsWith("ls "))
      return ["about/   experience/   work/   skills/   contact/"];
    if (name === "pwd") return ["~/aryan/portfolio"];
    if (name === "whoami")
      return ["Aryan Tuwar - backend & full-stack engineer who sweats the money-handling edge cases."];
    if (name === "coffee")
      return ["☕ brewing… ✓ caffeine nominal. shipping continues."];
    if (name === "matrix") {
      window.dispatchEvent(new CustomEvent("start-matrix"));
      return ["entering the matrix… (press esc to exit)"];
    }
    if (name === "stop" || name === "pause") {
      window.dispatchEvent(new CustomEvent("stop-bass"));
      return ["⏹ bass stopped."];
    }
    if (name === "hire" || name === "hire me" || name === "hireme")
      return ["excellent decision. → aryantuwar676@gmail.com"];
    if (name === "joke") return [JOKES[history.length % JOKES.length]];
    if (name === "exit" || name === "quit")
      return ["there is no exit - but there is a scroll bar ↑"];
    if (name === "neofetch")
      return [
        "aryan@portfolio",
        "---------------",
        "role     backend + full-stack",
        "company  Mogo (fintech)",
        "stack    TS · NestJS · Next.js · React Native",
        "status   shipping 🚀",
      ];
    return null;
  };

  const execute = (rawInput: string) => {
    const raw = rawInput.trim();
    if (!raw) return;
    push({ kind: "cmd", text: raw });

    const name = raw.replace(/^\//, "").toLowerCase();

    if (name === "help" || name === "?") {
      push({ kind: "out", text: "available commands - type / to autocomplete:" });
      commands.forEach((c) =>
        push({ kind: "out", text: `  /${c.label.padEnd(11)} ${c.desc}` })
      );
      push({ kind: "out", text: `  /clear       wipe the screen` });
      push({ kind: "out", text: `psst… also try: sudo · coffee · joke · ls · neofetch · matrix · play` });
    } else if (name === "clear" || name === "cls") {
      setHistory([]);
    } else {
      const cmd = matchCommand(commands, raw);
      if (cmd) {
        const msg = cmd.run();
        if (msg) push({ kind: "out", text: msg });
      } else {
        const egg = easterEgg(name);
        if (egg) {
          push(...egg.map((text) => ({ kind: "out" as const, text })));
        } else {
          push({
            kind: "err",
            text: `command not found: ${name} - type /help`,
          });
        }
      }
    }
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggest && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        setInput(`/${suggestions[sel].label}`);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        execute(`/${suggestions[sel].label}`);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setInput("");
        return;
      }
    }
    if (e.key === "Enter") {
      e.preventDefault();
      execute(input);
    }
  };

  const colorFor = (k: Line["kind"]) =>
    k === "err" ? "text-term-red" : k === "cmd" ? "text-fg" : "text-fg-muted";

  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[92svh] max-w-[var(--max-w)] flex-col justify-center px-5 pt-28 pb-16"
    >
      {/* always-present, crawlable heading for SEO */}
      <h1 className="sr-only">
        {profile.name} - {profile.role}. {profile.tagline}
      </h1>

      {/* status pill */}
      {profile.status && (
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-bg-raised px-3 py-1.5 text-xs text-fg-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {profile.status}
        </div>
      )}

      <div className="rounded-xl border border-border-strong bg-bg-raised shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-term-red" />
          <span className="h-3 w-3 rounded-full bg-term-yellow" />
          <span className="h-3 w-3 rounded-full bg-term-green" />
          <span className="ml-3 font-mono text-xs text-fg-dim select-none">
            {profile.handle}@{profile.host} - zsh
          </span>
        </div>

        <div
          onClick={() => inputRef.current?.focus()}
          className="min-h-[21rem] cursor-text p-5 font-mono text-sm sm:min-h-[20rem] sm:p-7 sm:text-base"
        >
          {/* intro: whoami -> name */}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="shrink-0 text-fg-dim">{PROMPT}</span>
            <span>
              {step > 0 ? "whoami" : <span>{typed}<span className="cursor" /></span>}
            </span>
          </div>
          {step > 0 && (
            <div className="term-pop mt-1 mb-3" aria-hidden>
              <p className="text-3xl font-bold tracking-tight text-fg sm:text-5xl">
                {profile.name}
              </p>
              <p className="mt-1 text-fg-muted">{profile.role}</p>
            </div>
          )}

          {/* intro: cat mission -> tagline */}
          {step > 0 && (
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="shrink-0 text-fg-dim">{PROMPT}</span>
              <span>
                {step > 1 ? "cat mission.txt" : <span>{typed}<span className="cursor" /></span>}
              </span>
            </div>
          )}
          {step > 1 && (
            <p className="term-pop mt-1 mb-3 text-lg text-accent sm:text-xl">
              &ldquo;{profile.tagline}&rdquo;
            </p>
          )}

          {/* command history */}
          {introDone && (
            <div ref={scrollRef} className="max-h-56 overflow-y-auto">
              {history.length === 0 && (
                <p className="mb-3 text-fg-dim">
                  &gt; type <span className="text-accent">/</span> to explore, or{" "}
                  <span className="text-accent">/help</span> for commands.
                </p>
              )}
              {history.map((l, i) => (
                <div key={i} className="flex flex-wrap items-baseline gap-x-2">
                  {l.kind === "cmd" && (
                    <span className="shrink-0 text-fg-dim">{PROMPT}</span>
                  )}
                  <span className={`whitespace-pre-wrap ${colorFor(l.kind)}`}>
                    {l.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* live input */}
          {introDone && (
            <div className="relative">
              <div className="flex items-baseline gap-x-2">
                <span className="shrink-0 text-fg-dim">{PROMPT}</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="Terminal command input"
                    placeholder="try /about"
                    className="w-full bg-transparent text-fg caret-accent outline-none focus:outline-none focus-visible:outline-none placeholder:text-fg-dim"
                  />
                </div>
              </div>

              {/* slash autocomplete */}
              {showSuggest && (
                <ul className="mt-2 overflow-hidden rounded-lg border border-border bg-bg-overlay">
                  {suggestions.length === 0 && (
                    <li className="px-3 py-2 text-xs text-fg-dim">no matches</li>
                  )}
                  {suggestions.map((c, i) => (
                    <li key={c.id}>
                      <button
                        onMouseMove={() => setSel(i)}
                        onClick={() => execute(`/${c.label}`)}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs transition-colors ${
                          i === sel ? "bg-accent-dim text-fg" : "text-fg-muted"
                        }`}
                      >
                        <span>
                          <span className={i === sel ? "text-accent" : "text-fg-dim"}>
                            /
                          </span>
                          {c.label}
                          <span className="ml-3 text-fg-dim">{c.desc}</span>
                        </span>
                        <span className="text-[10px] text-fg-dim">{c.hint}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href="#work"
          className="rounded-lg bg-btn-bg px-4 py-2.5 font-mono text-sm font-semibold text-btn-fg transition hover:bg-btn-bg-hover"
        >
          View work &gt;
        </a>
        <a
          href={socials.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-border-strong bg-bg-raised px-4 py-2.5 font-mono text-sm text-fg transition hover:border-accent hover:text-accent"
        >
          GitHub
        </a>
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-border-strong bg-bg-raised px-4 py-2.5 font-mono text-sm text-fg transition hover:border-accent hover:text-accent"
        >
          LinkedIn
        </a>
      </div>

      {/* konami hint */}
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] text-fg-dim">
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

      {/* stat strip */}
      <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-7">
        {profile.stats.map((s) => (
          <div key={s.label}>
            <dt className="font-mono text-2xl font-bold text-fg sm:text-3xl">
              {s.value}
            </dt>
            <dd className="mt-1 text-xs text-fg-muted">{s.label}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-10 font-mono text-xs text-fg-dim">
        Type a command above, or press{" "}
        <kbd className="rounded border border-border-strong bg-bg-overlay px-1.5 py-0.5 text-fg-muted">
          ⌘ K
        </kbd>{" "}
        anywhere.
      </p>
    </section>
  );
}
