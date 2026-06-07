# Bots & Buyers - Design Brief

A prompt + reference for redesigning the **Bots & Buyers** web app (Lio's "Agentic World" conference experience). Use this as the starting point for a fresh design attempt. **Keep the brand DNA below - it must still read unmistakably as Lio - but you are free to push the layout, motion, data-visualisation and polish further.**

The goal: make it feel **more premium, more delightful, more memorable**, without losing the editorial, trustworthy, enterprise-procurement feel. It is used on **phones, on a conference floor** - so mobile-first (design for 375px width up), fast, thumb-friendly.

---

## What the app is

Attendees sign in (email + name, no password), then:
1. **Browse** 32 procurement AI "agents" in a booklet (6 categories / "worlds").
2. **Build a set-up** by spending a **€1,000,000 budget** across agents - with **live ROI** (hard savings + FTEs freed). This is the hero feature.
3. **Checkout** - one tap to request a demo / offer / analysis / callback.
4. **Play** a "Wer wird Millionär" procurement quiz.
There's also an internal **admin** dashboard (data-dense, desktop-ish) for the sales team.

---

## Brand DNA - keep this

**Feel:** editorial, refined, premium, confident - a high-end business magazine meets a modern SaaS product. Generous whitespace, restraint, sharp details. NOT playful/cartoonish, NOT generic-startup. Avoid purple/blue gradients, neon, and "AI slop" aesthetics.

**Colour palette (hex):**
| Role | Colour |
|---|---|
| Background | cream `#F7F5F2` |
| Text / ink | navy `#0A1624` |
| Cards | white on cream; dark surfaces = slate `#0D1F30` |
| Muted text | slate `#525F6F` |

**Per-"world" accent colours** - each agent category re-themes its whole section (numerals, slider fills, rails, chips, the "live" dot):
| World | Accent |
|---|---|
| Services | navy `#0A1624` |
| SRM (supplier) | sand `#BB9681` |
| P2P | sage `#659F9D` |
| S2C (sourcing) | teal `#447279` |
| P2S (strategy) | amber `#DC9D09` |
| Other | slate `#525F6F` |

**Typography:** **Helvetica Neue** everywhere (system font; falls back to Helvetica / Arial). Tight negative letter-spacing on large display headings + numbers; tracked **UPPERCASE** for small eyebrow/label text (~0.22em, ~0.68rem); big **tabular** numerals for money + metrics. (History: it was a refined editorial serif - GT Sectra / Fraunces - before; we switched to Helvetica Neue. A serif display face could come back if it's editorial, not generic.)

**Shape & elevation:** very small radius (~2px - deliberately sharp / editorial). Soft, **category-tinted** shadows (a navy ambient layer + an accent-tinted glow). 1px borders + faint gradient hairlines. Backdrop-blur on sticky bars.

**Motion (restrained):** a staggered **fade-rise** on load (rise ~14px + fade, `cubic-bezier(.22,1,.36,1)`, staggered 80-440ms); a **slide + blur** transition between agent "stops"; slow ken-burns on imagery; confetti on a win/checkout. Respect `prefers-reduced-motion`. One well-orchestrated entrance beats scattered micro-animations.

**Signature components:**
- **Cards:** white, 1px border, ~2px radius, a coloured **left accent rail**, soft category-tinted shadow, strong title + muted body.
- **Eyebrow labels:** tracked uppercase, muted.
- **Display numbers:** big tabular numerals in the accent colour (€ amounts, metrics, the "03" chapter plates).
- **Chips:** small accent-tinted pills (uppercase).
- **Sliders:** thin track, accent fill, accent-ringed thumb.
- **Bottom tab nav (mobile):** Home / Agents / [raised centre **Build** button] / Quiz / Menu.
- **Sticky header:** Lio leaf logo (left) + a **€-balance pill** (right).

**Logo:** the Lio leaf mark (stylised crescent/leaf) + "Lio" wordmark, `currentColor` (ink on cream, cream on navy). SVG is at `app/icon.svg` / `components/lio-logo.tsx`.

**Voice:** confident, concise, a little witty, procurement-savvy. UI is English; the quiz is bilingual DE/EN. In German, address users in the singular ("du"). **Use only the plain hyphen `-`, never em/en dashes.**

---

## Key screens to (re)design

1. **Login** - "Welcome to the Agentic World." email + name, no password.
2. **Home hub** - personalised greeting, the **€1M budget card** (reflects live progress: backed / left / ROI modelled), a grid of section cards.
3. **Agent booklet** - "Pick your Agent": six numbered category sections of cards -> **agent detail** with a dot+label **"stops" navigator** (Agent / Business Case / Case Study / Deep Dive), each re-themed to the agent's accent, with a **live ROI calculator** (sliders -> live €/FTE results).
4. **The €1M funnel ("Build")** - allocate budget across agents (sliders), a live **"indicative annual impact"** card (€ saved + FTEs freed), a **room leaderboard**, checkout CTA. **The hero.**
5. **Checkout** - set-up recap + one-tap request (demo / offer / analysis / callback) + confetti.
6. **Quiz** - "Wer wird Millionär": prize ladder, lifelines (50:50 / audience / phone), big question card, A-D answers, win screen.
7. **Admin** (internal) - dense data dashboard: stats, follow-up request cards, leaderboard, attendees table, CSV export.

---

## Tech constraints (so the design is buildable)

- **Next.js (App Router) + Tailwind CSS v4 + shadcn/ui on Base UI.** Design tokens live in `app/globals.css` (`@theme` + HSL triplets). Category theming = a `data-agent="<world>"` attribute that flips the `--agent` colour for everything inside.
- **Mobile-first** (centred `max-w-2xl` content column), installable **PWA**.
- **Accessible:** WCAG AA contrast, visible focus, zoomable, `prefers-reduced-motion`, ~44px touch targets.

## What's open to reinvent

Layout creativity, richer empty/loading states, stronger **data-viz** for the ROI + leaderboard, hero moments, the funnel interaction model, subtle illustration/texture, the quiz's game-feel. Surprise us - but it must still feel unmistakably **Lio**.
