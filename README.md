# Bots & Buyers - Lio Conference Web App

A mobile-first web app for Lio's **"Bots & Buyers"** conference. Attendees sign
in with their email, browse Lio's 32 procurement AI agents, **spend a €1,000,000
"conviction budget"** to build their own agent set-up (which doubles as a vote),
watch their **ROI add up live**, and **request a demo / offer / analysis** at
checkout. There's also a **"Wer wird Millionär"** quiz. Everything a participant
does is saved against their email so the sales team can follow up.

> **This README is a handoff document.** It's written so another developer (or
> AI) can run, finish, customize and deploy this codebase with zero prior
> context. Read it top to bottom once.

---

## Table of contents

1. [Status: what's built / what's left](#1-status)
2. [Tech stack & important version notes](#2-tech-stack)
3. [Quick start (run it locally)](#3-quick-start)
4. [Creating two identical copies](#4-two-copies) ← the duplication workflow
5. [Project structure](#5-structure)
6. [Architecture & key concepts](#6-architecture)
7. [Editing content (agenda, workshops, venue, agents, quiz)](#7-content)
8. [Data model](#8-data-model)
9. [Environment variables](#9-env)
10. [Deployment](#10-deployment)
11. [Known issues & gotchas - READ THIS](#11-gotchas)
12. [Conventions / house style](#12-conventions)

---

<a name="1-status"></a>
## 1. Status - what's built / what's left

**Done & working (verified in the browser):**

| Area | Status | Notes |
|---|---|---|
| Design system + app shell | ✅ | Lio CI ported 1:1 (cream/navy + per-category accents, editorial serif), mobile bottom-nav with raised "Build" button, menu sheet, header with live €-balance pill |
| Data layer | ✅ | Prisma (SQLite), 32 agents + all 31 ROI calculators, content modules |
| Login + session | ✅ | Friction-free email+name (no password), 60-day cookie, route gate, admin detection |
| Agent Booklet | ✅ | Catalog (6 category sections) + per-agent detail with 4 "stops" (Agent / Business Case / Case Study / Deep Dive) + live ROI calculators |
| €1M funnel | ✅ | Allocate budget across agents, live aggregate ROI (€ saved + FTEs freed), autosave to DB, room leaderboard |
| Checkout | ✅ | Set-up recap + one-tap request (Demo / Offer / Analysis / Callback) + note → persisted `CheckoutRequest` |
| Info pages | ✅ | Agenda (timeline), Workshops, Lageplan - all driven by editable content modules with a "sample content" banner until real content is added |
| Wer wird Millionär quiz | ✅ | Full bilingual (DE/EN) game: 15 prize levels, safe havens, lifelines, sound, scoring; saves `QuizResult` |
| Admin dashboard (`/admin`) | ✅ | Passcode **or** `@lio.ai` gate; room stats, **follow-up request cards** (who/what/ROI/note), most-backed leaderboard, full attendees table, **CSV export** (`/admin/export`) |
| Polish | ✅ | Branded Lio app icon (`app/icon.svg`), PWA manifest with icons, real SEO/OG metadata, zoom-enabled (a11y), `prefers-reduced-motion` handled. Production build is green. |

**Remaining (optional):**

| Area | Notes |
|---|---|
| Live website audit | Install the `squirrel` CLI ([squirrelscan.com/download](https://squirrelscan.com/download)) and run `squirrel audit <url>` for an SEO/perf/security report. The app is auth-gated, so a crawler mostly sees `/login` - most useful run against the deployed `/login`. |
| OG share image + raster PWA icons | An SVG icon is in place; add a PNG `app/apple-icon.png` and an OG image if you want richer link previews / iOS home-screen polish. |
| Real conference content | Fill `lib/content/*` (agenda, workshops, venue) and flip the `*_IS_PLACEHOLDER` flags - see [§7](#7-content). |

---

<a name="2-tech-stack"></a>
## 2. Tech stack & important version notes

- **Next.js 16** (App Router, React Server Components, Turbopack dev) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** - configured in CSS via `@theme` (there is **no `tailwind.config.js`**). All design tokens live in `app/globals.css`.
- **shadcn/ui built on Base UI** (`@base-ui/react`) - **not Radix.** This matters (see [gotchas](#11-gotchas)).
- **Prisma v6** (`6.19.x`) + **SQLite** for dev. Pinned to v6 on purpose - Prisma 7 requires driver adapters and is more fragile on this stack.
- **jose** (signed JWT session cookie), **zod** (validation), **motion** + **canvas-confetti** (animation deps available), **lucide-react** (icons), **sonner** (toasts).
- Fonts via `next/font/google`: **Fraunces** (display serif) + **Inter** (body) - substitutes for Lio's licensed GT Sectra / Söhne (swap-in instructions below).

---

<a name="3-quick-start"></a>
## 3. Quick start (run it locally)

Requires **Node 20+** (built on Node 25).

```bash
# 1. install deps
npm install

# 2. set up env
cp .env.example .env
#    then set a unique SESSION_SECRET:  openssl rand -base64 48

# 3. create the database + generate the Prisma client
npx prisma migrate dev

# 4. run it
npm run dev          # http://localhost:3000
```

Open `http://localhost:3000` → you'll be redirected to `/login` → enter any name
+ email → you're in. (Use an `@lio.ai` email to get the admin flag.)

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run lint`.

---

<a name="4-two-copies"></a>
## 4. Creating two identical copies

The two versions are **identical apps with separate data + deployments**. Each
copy is fully self-contained. To make a copy:

```bash
# from the parent directory
cp -R bots-and-buyers bots-and-buyers-copy2
cd bots-and-buyers-copy2

rm -rf node_modules .next prisma/dev.db        # start clean (these are gitignored anyway)
npm install
cp .env.example .env
#   → set a NEW unique SESSION_SECRET for this copy (openssl rand -base64 48)
#   → set its own DATABASE_URL (its own SQLite file, or its own Postgres DB)
npx prisma migrate dev
npm run dev
```

**Each copy must have:**
- its **own `SESSION_SECRET`** (so sessions/cookies don't collide across copies),
- its **own database** (`DATABASE_URL`) - this is what keeps the two events' data
  separate,
- its **own deployment / domain**.

Nothing else needs to change - the code is identical. If you later want the two
copies to *differ* (branding, agenda, etc.), everything customer-facing is in the
content modules (see [§7](#7-content)) and the design tokens in `app/globals.css`.

---

<a name="5-structure"></a>
## 5. Project structure

```
app/
  layout.tsx                  # root: fonts (Fraunces+Inter), metadata, <Toaster/>
  globals.css                 # ⭐ ALL design tokens + Lio utilities (Tailwind v4 @theme)
  manifest.ts                 # PWA manifest (icons still TODO)
  login/                      # /login - email+name form (server action + client form)
  api/auth/logout/route.ts    # POST → clears session → /login
  (app)/                      # authenticated shell (header + bottom-nav); gates to /login
    layout.tsx                # auth gate + passes participant + €-balance into the shell
    page.tsx                  # / - home hub
    agents/                   # /agents catalog + /agents/[agentId] detail (4 stops)
    build/                    # /build - the €1M funnel (page + server actions)
    checkout/                 # /checkout - request demo/offer/analysis (page + actions)
    agenda/  map/  workshops/ # info pages (driven by lib/content/*)
    millionaire/              # /millionaire - quiz (page + saveQuizResult action)
    # admin/                  # ❌ TODO: sales dashboard (task #9)

components/
  lio-logo.tsx                # real Lio leaf mark + wordmark (currentColor SVG)
  app-shell/                  # header, bottom-nav, menu-sheet
  agents/                     # agent-card, agent-detail (the 4-stop viewer), roi-calculator
  funnel/                     # funnel (main €1M component), add-agents-sheet
  checkout/                   # checkout
  quiz/                       # millionaire (the full game, ~500 lines)
  content/                    # sample-banner
  ui/                         # shadcn (Base UI) primitives - button, slider, sheet, etc.

lib/
  agents.ts                   # typed agent catalog + category metadata (loads data/agents.json)
  calculators.ts              # all 31 ROI formulas + roiContribution()/hoursToFte() aggregation
  funnel.ts                   # server: budget state, leaderboard, set-up snapshot (ROI totals)
  auth.ts                     # getCurrentParticipant(), participantIsAdmin(), emailIsAdmin()
  session.ts                  # jose-signed cookie: create/get/destroy
  db.ts                       # Prisma client singleton
  format.ts                   # formatEur (€1.2M), formatEurFull, hours, ONE_MILLION
  content/                    # ✏️ EDIT THESE - event, agenda, workshops, venue, quiz
  utils.ts                    # cn()

data/agents.json              # the 32 agents (content from the original Lio app)
prisma/schema.prisma          # data model
```

---

<a name="6-architecture"></a>
## 6. Architecture & key concepts

**Routing & shell.** Everything authenticated lives under the `app/(app)/` route
group, whose `layout.tsx` fetches the current participant and **redirects to
`/login` if there's no session**, then renders the sticky header + fixed bottom
nav. `/login` sits outside the group (no shell).

**Auth (friction-free).** `app/login` upserts a `Participant` by email (no
password) and sets a signed `bb_session` cookie (`lib/session.ts`, jose HS256,
60-day). `lib/auth.ts#getCurrentParticipant()` (React-`cache`d) reads it in
server components/actions. Admin = `participant.isAdmin` OR email in
`ADMIN_EMAILS` OR ends with `@lio.ai`.

**Design system → `app/globals.css`.** Tailwind v4. Colors are HSL **triplets**
(e.g. `--agent: 178 23% 51%`) so they compose with alpha (`hsl(var(--agent)/.6)`).
The `@theme` block wraps them as `--color-*` so utilities like `bg-agent`,
`text-agent`, `bg-background` work. **Category theming:** put
`data-agent="p2p|srm|s2c|p2s|services|others"` on any element and its whole
subtree re-themes to that category's accent color (the `--agent` variable flips).
Custom utilities: `.display-num` (serif tabular numerals), `.label-uppercase`
(eyebrows), `.lio-surface-light`, `.lio-accent-rail`, `.lio-chip`, `.lio-stage`,
`.shadow-lio`, and the `lio-rise` / `lio-slide-enter` entrance animations.

**The €1M funnel (the core).** `components/funnel/funnel.tsx` (client) holds the
set-up as `{agentId, amountEur, inputs}[]`. It computes **live aggregate ROI** via
`roiContribution()` per agent (€ hard savings + hours→FTEs) and **autosaves**
(debounced) through the `saveAllocation` / `removeAllocation` server actions in
`app/(app)/build/actions.ts`. The €1M is server-clamped so allocations never
exceed the budget. An allocation **is** the participant's vote → the room
leaderboard (`getLeaderboard`) aggregates allocations across everyone.

**ROI calculators.** `lib/calculators.ts` ports all 31 per-agent formulas from the
original Lio app (e.g. Guided Buying: `maverick × 0.75 × savingsRate`). The same
`RoiCalculator` component powers the booklet's Business Case stop and the funnel's
"Tune ROI" panel. `roiContribution()` reduces an agent's outputs to
`{hardEur, hoursPerYear}` for aggregation; `hoursToFte()` converts (1,840 h/FTE/yr).

**Checkout.** `getSetupSnapshot()` computes the full set-up + ROI server-side; the
checkout writes a `CheckoutRequest` with a JSON snapshot of exactly what the
participant had + which intent they chose. **This is the conversion record sales
follows up on.**

---

<a name="7-content"></a>
## 7. Editing content

All customer-facing copy is in **`lib/content/`** - edit these, no component
changes needed:

- **`event.ts`** - event name, date label, venue. ✏️ Set the real values.
- **`agenda.ts`** - sessions (time/title/speaker/location/kind). Set
  `AGENDA_IS_PLACEHOLDER = false` to hide the "sample programme" banner.
- **`workshops.ts`** - workshop list. Set `WORKSHOPS_IS_PLACEHOLDER = false`.
- **`venue.ts`** - drop a floor-plan image at `/public/lageplan.png`, set
  `MAP_IMAGE = "/lageplan.png"`, and edit the points of interest. Set
  `VENUE_IS_PLACEHOLDER = false`.
- **`quiz.ts`** - the bilingual question bank (15 easy / 15 medium / 15 hard),
  prize ladder, and all UI strings. ⚠️ The "phone-a-friend" lifeline contains
  real internal names (`phone_names`) - review before public use.

The **agents** themselves are in `data/agents.json` (typed by `lib/agents.ts`).
ROI formulas for any agent live in `lib/calculators.ts`, keyed by agent id.

---

<a name="8-data-model"></a>
## 8. Data model (`prisma/schema.prisma`)

```
Participant      id, email (unique), name, company?, isExistingCustomer,
                 isAdmin, locale, createdAt, updatedAt
Allocation       participant, agentId, amountEur, roiInputsJson?   (unique per participant+agent)
                 → how much of the €1M they backed an agent with (= their vote) + ROI inputs
CheckoutRequest  participant, type (demo|offer|analysis|callback), note?, payloadJson, status
                 → a conversion event; payloadJson = full set-up + ROI snapshot
QuizResult       participant, score, levelReached, correctCount, totalAnswered, locale
```

JSON is stored as `String` (not the Prisma `Json` type) so the schema stays
portable between SQLite and Postgres. No enums for the same reason.

---

<a name="9-env"></a>
## 9. Environment variables

See `.env.example`. Summary:

| Var | Purpose |
|---|---|
| `DATABASE_URL` | DB connection. SQLite file for dev; Postgres for prod. |
| `SESSION_SECRET` | HMAC secret for the login cookie. **Unique per copy.** |
| `ADMIN_EMAILS` | Comma-separated admin emails (plus any `@lio.ai`). |
| `ADMIN_PASSCODE` | Passcode for the (to-be-built) `/admin` dashboard. |

---

<a name="10-deployment"></a>
## 10. Deployment

- **Vercel / serverless:** SQLite does **not** persist on serverless. Switch to
  **Postgres**: set `provider = "postgresql"` in `prisma/schema.prisma`, set
  `DATABASE_URL` to a Postgres URL (Neon, Supabase, Vercel Postgres…), then
  `npx prisma migrate deploy`. Build with `npm run build`.
- **Azure Static Web Apps** (where the original Lio app lived) can host Next via
  its Node support, or use Azure App Service. Postgres still recommended.
- **Long-lived Node host / container:** SQLite is fine if the disk persists.
- Set all env vars in the host's dashboard. Each of the two copies = its own
  project/deployment + its own DB + its own `SESSION_SECRET`.

---

<a name="11-gotchas"></a>
## 11. Known issues & gotchas - READ THIS

1. **shadcn uses Base UI, not Radix.** Components take a **`render` prop**, not
   `asChild`. When you render a button-primitive (e.g. `SheetClose`,
   `SheetTrigger`) **as a link**, you MUST pass `nativeButton={false}` or React
   logs a console error. Example in `components/app-shell/menu-sheet.tsx`.
2. **Tailwind v4 / no config file.** Add design tokens in `app/globals.css`
   (`:root` triplets + `@theme` mapping). Don't look for `tailwind.config.js`.
3. **Prisma is pinned to v6.** Don't `npm i prisma@latest` (v7) without migrating
   to driver adapters - it'll break the classic `url = env(...)` setup.
4. **Fonts are substitutes.** Fraunces/Inter stand in for licensed GT Sectra /
   Söhne. To use the real fonts: drop the woff2 files in, register them in
   `app/layout.tsx` (`next/font/local`), and point `--font-serif` / `--font-sans`
   at them in `globals.css`.
5. **Header €-balance is server-rendered** - it updates on navigation, not live
   while you drag sliders on `/build` (the funnel shows its own live balance).
   Fine as-is; if you want it live, lift balance to a client context or
   `router.refresh()` after saves.
6. **Allocation autosave edge case.** During an abnormally long dev session (a
   `/build` page left mounted through many HMR reloads) an agent's allocation was
   once observed reset to €0. Not reproduced in normal use, but before going live
   it's worth (a) re-verifying autosave under rapid slider edits and (b)
   considering persisting on slider **commit** rather than on every change.
7. **3 agents are mis-tagged `p2s`** in `data/agents.json` (`order-bundling-agent`,
   `contract-surveillance-agent`, `spend-to-contract-agent`) - inherited from the
   original Lio data. Re-tag if you want them under P2P/S2C instead.
8. **Verify console is clean after a preview/dev restart, not during.** The dev
   console buffer accumulates across client navigations; stale errors can linger.

---

<a name="12-conventions"></a>
## 12. Conventions / house style

- **Mobile-first.** Content column is `max-w-2xl` centered; design for 375px up.
- **Theme by category** with `data-agent`; never hardcode category colors.
- **Server components by default**; `"use client"` only for interactivity
  (funnel, calculator, quiz, forms). Persist via **server actions**, validate
  with **zod**.
- **Numbers** use `.display-num` (serif tabular) and the `lib/format.ts` helpers
  so currency/units render consistently with the original Lio app.
- Entrance motion = `lio-rise` (+ staggered `lio-rise-1..5`); stop/section
  changes = `lio-slide-enter`. Respect `prefers-reduced-motion` (already handled
  in `globals.css`).

---

*Built to match the Lio "Agentic World" CI. Design tokens, agent content and ROI
formulas were ported from the original app's handoff kit.*
