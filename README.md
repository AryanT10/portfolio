# aryan tuwar — portfolio

A terminal-styled personal site. Backend & full-stack engineer, Toronto.

```bash
$ whoami
Aryan Tuwar — I build backends that don't lose money.
```

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4**
- Static export (`output: "export"`) — ships as plain HTML/CSS/JS, no runtime
- Geist Sans + Geist Mono

## Features

- Interactive hero terminal — type `/` for slash-command navigation
- `⌘K` command palette (shares one command registry with the terminal)
- Engineering case studies, light/dark theme, scroll reveals
- Fully responsive, reduced-motion aware, SEO/OG metadata

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export -> ./out
```

## Content

All copy lives in [`lib/content.ts`](lib/content.ts) — one source of truth.

## Deploy

Static export in `./out`. Hosted on Cloudflare Pages
(build command `npx next build`, output directory `out`).
