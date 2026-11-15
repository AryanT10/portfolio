"use client";

import { useMemo } from "react";
import { socials } from "@/lib/content";

export type Command = {
  id: string;
  label: string; // shown after the leading slash, e.g. "about"
  desc: string;
  hint: "section" | "link" | "action";
  aliases?: string[];
  /** performs the side effect and returns a short echo line for the terminal */
  run: () => string;
};

function scrollTo(hash: string) {
  requestAnimationFrame(() => {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  });
}

function toggleTheme(): string {
  const el = document.documentElement;
  const next = !el.classList.contains("light");
  el.classList.toggle("light", next);
  try {
    localStorage.setItem("theme", next ? "light" : "dark");
  } catch {}
  return `theme → ${next ? "light" : "dark"}`;
}

/**
 * Shared command registry. Powers both the hero terminal (where run()'s
 * return string is echoed) and the ⌘K palette (where it's ignored).
 */
export function useCommands(): Command[] {
  return useMemo(
    () => [
      {
        id: "about",
        label: "about",
        desc: "who I am",
        hint: "section",
        aliases: ["bio", "whoami"],
        run: () => {
          scrollTo("#about");
          return "cd ~/about";
        },
      },
      {
        id: "experience",
        label: "experience",
        desc: "Mogo + engineering case studies",
        hint: "section",
        aliases: ["work-history", "mogo", "exp"],
        run: () => {
          scrollTo("#experience");
          return "cd ~/experience";
        },
      },
      {
        id: "work",
        label: "work",
        desc: "projects I'm building",
        hint: "section",
        aliases: ["projects", "proj"],
        run: () => {
          scrollTo("#work");
          return "cd ~/work";
        },
      },
      {
        id: "skills",
        label: "skills",
        desc: "the toolbox",
        hint: "section",
        aliases: ["stack", "tools"],
        run: () => {
          scrollTo("#skills");
          return "cd ~/skills";
        },
      },
      {
        id: "contact",
        label: "contact",
        desc: "get in touch",
        hint: "section",
        aliases: ["hire", "reach", "message"],
        run: () => {
          scrollTo("#contact");
          return "cd ~/contact";
        },
      },
      {
        id: "email",
        label: "email",
        desc: "copy my email address",
        hint: "action",
        aliases: ["mail", "copy"],
        run: () => {
          try {
            navigator.clipboard?.writeText(socials.email);
          } catch {}
          return `copied ${socials.email} to clipboard`;
        },
      },
      {
        id: "github",
        label: "github",
        desc: "code on GitHub",
        hint: "link",
        aliases: ["gh"],
        run: () => {
          window.open(socials.github, "_blank");
          return "opening github…";
        },
      },
      {
        id: "linkedin",
        label: "linkedin",
        desc: "connect on LinkedIn",
        hint: "link",
        aliases: ["li"],
        run: () => {
          window.open(socials.linkedin, "_blank");
          return "opening linkedin…";
        },
      },
      {
        id: "play",
        label: "play",
        desc: "dubstep wobble (synth)",
        hint: "action",
        aliases: ["music", "bass"],
        run: () => {
          window.dispatchEvent(new CustomEvent("toggle-bass"));
          return "♪ toggling the bass synth";
        },
      },
      {
        id: "theme",
        label: "theme",
        desc: "toggle light / dark",
        hint: "action",
        aliases: ["dark", "light", "mode"],
        run: () => toggleTheme(),
      },
    ],
    []
  );
}

export function matchCommand(commands: Command[], raw: string): Command | undefined {
  const q = raw.trim().replace(/^\//, "").toLowerCase();
  if (!q) return undefined;
  return commands.find(
    (c) => c.label === q || c.id === q || c.aliases?.includes(q)
  );
}

export function filterCommands(commands: Command[], raw: string): Command[] {
  const q = raw.trim().replace(/^\//, "").toLowerCase();
  if (!q) return commands;
  return commands.filter(
    (c) =>
      c.label.includes(q) ||
      c.id.includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.aliases?.some((a) => a.includes(q))
  );
}
