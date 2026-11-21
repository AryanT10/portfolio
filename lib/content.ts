/* ============================================================
   Content layer - single source of truth for the whole site.
   Edit text here; components render it.
   ------------------------------------------------------------
   TODO(aryan): confirm the 3 values in CONFIG below.
   ============================================================ */

export const CONFIG = {
  // The public URL the site lives at (used for SEO/OG canonical).
  // Update this if you add a custom domain later.
  siteUrl: "https://aryantuwar.is-a.dev",
  // Contact email shown on the site + used for the mailto link.
  email: "aryantuwar676@gmail.com",
};

export const profile = {
  name: "Aryan Tuwar",
  handle: "aryan",
  host: "portfolio",
  role: "Backend & Full-Stack Engineer",
  location: "Toronto, ON",
  // The one-liner. Punchy, true, memorable.
  tagline: "I build backends that don't lose money.",
  // Status pill - recruiter catnip. Set back to the string to re-enable.
  // e.g. "Open to Summer 2027 new-grad & internship roles"
  status: "",
  // Short bio (prose, 2 short paragraphs).
  bio: [
    "I'm a software engineer at Mogo, where I ship production fintech on the Lending and Wealth teams - NestJS lending APIs, a Next.js customer app, and a React Native investing app used by real customers moving real money.",
    "I like the unglamorous parts: idempotency, race conditions, graceful degradation, and the timezone bug that only fires between 8pm and midnight. On the side I build AI products end to end. Currently pursuing an Honours Bachelor's in Software Engineering at Seneca Polytechnic.",
  ],
  stats: [
    { value: "260+", label: "PRs merged at Mogo" },
    { value: "11 mo", label: "shipping production fintech" },
    { value: "2", label: "teams: Lending & Wealth" },
  ],
};

export const socials = {
  github: "https://github.com/AryanT10",
  linkedin: "https://www.linkedin.com/in/aryan-tuwar-6b29291a9",
  email: CONFIG.email,
};

/* ---------------------------------------------------------------
   EXPERIENCE - Mogo, told honestly from the LinkedIn record.
   Three stints under one company.
--------------------------------------------------------------- */
export type Role = {
  title: string;
  kind: string;
  period: string;
  team: string;
  summary: string;
  highlights: string[];
};

export const experience = {
  company: "Mogo",
  companyNote: "Toronto · Remote",
  totalPeriod: "Jan 2026 - Present",
  roles: [
    {
      title: "Junior Full Stack AI Engineer",
      kind: "Permanent · current",
      period: "Sep 2026 - Present",
      team: "Lending",
      summary:
        "Carried on past the co-op, driving Mogo's Line of Credit product through pre-launch hardening toward production launch.",
      highlights: [
        "Shipping backend (NestJS) and web (Next.js) changes at a steady weekly cadence - money-safety, observability, and reliability as the product moves to launch.",
        "Caught money-movement bugs during pre-launch testing - a funding-file reconciliation gap that could have disbursed unvalidated draws, and a $0-limit credit line that could be created, activated, and auto-paid.",
        "Built an operational-errors pipeline + admin reporting tool so on-call can triage alerts from 10+ services without external dashboards (errors used to hit Slack and vanish).",
        "Hardened CRM sync by classifying job failures (transient / permanent / ignored) with bounded retries + a dead-letter queue, killing a queue-poisoning failure class.",
        "Added a CI gate blocking out-of-order DB migrations after a multi-day dev outage, and cut a recurring 30s API-timeout cluster by replacing a slow vendor call with direct entity reads.",
      ],
    },
    {
      title: "Engineering Intern",
      kind: "Co-op",
      period: "Apr 2026 - Sep 2026",
      team: "Lending",
      summary:
        "Backend and web on Mogo's Line of Credit product - from application and agreement signing through draws, repayments, and statements.",
      highlights: [
        "Merged 120+ PRs in ~20 weeks across the NestJS/TypeScript lending API and the Next.js customer web app.",
        "Built the draw-request feature end to end - 9 backend endpoints plus customer UI, protected against duplicate submits and races with idempotency keys and DB advisory locks.",
        "Shipped self-serve cancel/edit for additional payments across backend + frontend, integrated with the LoanPro autopay API behind a feature flag.",
        "Set up autopay to be created automatically when each credit line opens - unblocking the entire repayment feature set.",
        "Built province-specific loan-agreement templates with versioning, so each province's legal terms are kept and versioned separately.",
      ],
    },
    {
      title: "Engineering Intern",
      kind: "Co-op",
      period: "Jan 2026 - Apr 2026",
      team: "Intelligent Investing (Wealth)",
      summary:
        "The mobile app that unifies Mogo's managed investing and self-directed trading in one experience.",
      highlights: [
        "Shipped 140+ merged PRs over 19 weeks across the React Native app and three backend services.",
        "Delivered full English/French localization across the mobile app.",
        "Built a feedback pipeline in Node/TypeScript posting to Slack, with sentiment analysis (AWS Comprehend) and FR→EN translation (AWS Translate).",
        "Audited pre-launch analytics coverage, then led adding event tracking across the app and backend services.",
        "Wrote a technical proposal comparing four over-the-air update options so JS-only fixes could ship without app-store review.",
      ],
    },
  ] as Role[],
};

/* ---------------------------------------------------------------
   CASE STUDIES - the crown jewels. Real engineering stories.
--------------------------------------------------------------- */
export type CaseStudy = {
  id: string;
  title: string;
  team: string;
  problem: string;
  approach: string;
  impact: string;
  tags: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "draw-engine",
    title: "A draw engine that never double-spends",
    team: "Lending",
    problem:
      "Customers draw money from a credit line. A double-submit, a retry, or two concurrent requests could send the same money to the loan system twice - a real financial bug, not a cosmetic one.",
    approach:
      "Built the feature end to end: 9 backend endpoints plus the customer UI. Guarded writes with idempotency keys and Postgres advisory locks, and split the money move into a two-phase finalize so the system always knows exactly what has already been sent downstream.",
    impact:
      "Duplicate submits and race conditions can't move money twice. The finalize step is crash-safe - it never loses track of funds already sent to the loan system.",
    tags: ["NestJS", "PostgreSQL", "idempotency", "advisory locks", "Next.js"],
  },
  {
    id: "money-safety",
    title: "Catching money-movement bugs before they ship",
    team: "Lending",
    problem:
      "As the Line of Credit product moved toward launch, testing kept surfacing edge cases where money could move incorrectly - a funding file that could disburse draws it had never validated, and a $0-limit credit line that could still be created, activated, and put on autopay.",
    approach:
      "Treated pre-launch testing as an active hunt, not a checkbox: reconciled each funding file against Mogo's own model of the draws it expected to disburse before marking it ready, and enforced a credit-limit floor at submit so an invalid line can't be created or activated downstream.",
    impact:
      "Multiple money-movement bugs caught and fixed the same week they surfaced, before any customer impact - the exact class of failure a lending backend can't ship with.",
    tags: ["NestJS", "funding reconciliation", "edge cases", "pre-launch QA"],
  },
  {
    id: "timezone-bug",
    title: "The bug that only happened after 8pm",
    team: "Lending",
    problem:
      "Every credit-line activation submitted between 8pm and midnight Eastern was silently failing. Earlier in the day, everything worked.",
    approach:
      "Traced it to a timezone mismatch: our servers ran on UTC, the vendor ran on Eastern. After 8pm ET, UTC rolls to the next calendar day - so the dates we sent no longer matched what the vendor expected.",
    impact:
      "Fixed the date handling at the boundary. Late-evening activations - a meaningful slice of daily volume - stopped failing.",
    tags: ["debugging", "timezones", "vendor integration"],
  },
  {
    id: "autopay",
    title: "Autopay, from zero",
    team: "Lending",
    problem:
      "No customer had autopay, which blocked the entire repayment feature set. Enabling it failed against the vendor with a vague 'malformed request' error that gave nothing to go on.",
    approach:
      "Made autopay get created automatically when each credit line opens. Reproduced the failure directly against the vendor sandbox to pin down the real cause of the malformed-request error, then shipped the fix behind a feature flag.",
    impact:
      "Repayments became possible for every customer - the foundation the self-serve cancel/edit payment features were then built on.",
    tags: ["NestJS", "LoanPro API", "feature flags"],
  },
  {
    id: "resilience",
    title: "A balance screen that stays up when the vendor goes down",
    team: "Lending",
    problem:
      "When LoanPro was unavailable, the balance screen showed customers an error - exactly when they're most anxious about their money.",
    approach:
      "Added graceful degradation: when live data isn't reachable, the screen falls back to the most recent archived snapshot instead of failing.",
    impact:
      "Customers keep seeing their balance through vendor outages, with no hard error state.",
    tags: ["resilience", "graceful degradation", "UX"],
  },
];

/* ---------------------------------------------------------------
   PROJECTS - featured, honest. Noise is deploy-ready; nutrivoice
   leads with engineering rigor (voice/AI layer is in progress).
--------------------------------------------------------------- */
export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  highlight: string;
  status: string;
  statusTone: "live" | "wip";
  private?: boolean;
  demo?: string;
  image?: string;
  icon?: string;
};

export const projects: Project[] = [
  {
    id: "noise",
    name: "Noise",
    tagline: "AI research assistant that shows where sources agree and disagree.",
    description:
      "Ask a question in plain language; Noise plans searches, scrapes the top pages, extracts discrete claims from each source, then synthesizes one cited answer that explicitly surfaces consensus, contradictions, and remaining uncertainty - not just a summary box.",
    stack: [
      "React Native / Expo",
      "FastAPI",
      "LangGraph",
      "Groq / OpenAI / Gemini",
      "FAISS",
      "PostgreSQL",
    ],
    highlight:
      "A real agentic LangGraph pipeline - claim extraction, evidence ranking, a consensus builder that flags contradictions, and conditional edges that loop for more evidence or short-circuit when there's nothing relevant. Hardened with per-user quotas, auth throttling, and cost caps.",
    status: "Building · App-Store prep",
    statusTone: "wip",
    private: true,
    image: "/projects/noise-1.png",
    icon: "/projects/noise-icon.png",
  },
  {
    id: "nutrivoice",
    name: "NutriVoice",
    tagline: "Voice-first nutrition tracking - say your meal, it's logged.",
    description:
      "Speak one sentence about a meal and it's logged with real nutrition data. The product thesis is friction reduction. Built as a strict TypeScript monorepo with a deliberate boundary: AI interprets what you ate, structured data decides what it contains - the model is never allowed to invent nutrition values.",
    stack: [
      "Expo / React Native",
      "Fastify",
      "Drizzle ORM",
      "PostgreSQL",
      "Zod",
      "Swift App Intents",
    ],
    highlight:
      "One-way-dependency monorepo, every AI response Zod-validated before use, idempotent meal writes, and local-date logic tested against 11:59pm, DST, and cross-timezone travel. Includes a Siri App Intent spike for logging from a locked device (716 tests passing).",
    status: "Currently building",
    statusTone: "wip",
    private: true,
    icon: "/projects/nutrivoice-icon.png",
  },
];

/* ---------------------------------------------------------------
   SKILLS - grouped, honest to what the work shows.
--------------------------------------------------------------- */
export const skills: { group: string; items: string[] }[] = [
  {
    group: "languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "Swift"],
  },
  {
    group: "backend",
    items: ["NestJS", "Fastify", "FastAPI", "Node.js", "Express", "REST APIs"],
  },
  {
    group: "frontend",
    items: ["React", "Next.js", "React Native", "Expo", "Tailwind CSS"],
  },
  {
    group: "data",
    items: ["PostgreSQL", "Drizzle", "SQLAlchemy", "MongoDB", "FAISS"],
  },
  {
    group: "ai",
    items: ["LangGraph", "LangChain", "AWS Comprehend", "AWS Translate", "RAG"],
  },
  {
    group: "practices",
    items: [
      "idempotency",
      "feature flags",
      "CI/CD",
      "testing",
      "graceful degradation",
    ],
  },
];

export const education = [
  {
    school: "Seneca Polytechnic",
    program: "Honours Bachelor's, Computer Software Engineering (BSD)",
    period: "Sep 2025 - 2028",
    current: true,
  },
  {
    school: "Seneca Polytechnic",
    program: "Advanced Diploma, Computer Programming & Analysis",
    period: "Jan 2023 - Apr 2025",
    current: false,
  },
];
