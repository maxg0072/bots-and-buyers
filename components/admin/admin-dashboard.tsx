import {
  Download,
  LogOut,
  Users,
  Sparkles,
  CalendarCheck,
  ReceiptText,
  LineChart,
  Phone,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { LioLogo } from "@/components/lio-logo";
import { formatEur, formatEurFull, formatInt } from "@/lib/format";
import type { AdminData } from "@/lib/admin";
import { exitAdmin } from "@/app/admin/actions";
import { CATEGORY_SHORT } from "@/lib/agents";
import { RequestStatus } from "./request-status";

const REQ_META: Record<string, { label: string; icon: LucideIcon }> = {
  demo: { label: "Demo", icon: CalendarCheck },
  offer: { label: "Offer", icon: ReceiptText },
  analysis: { label: "Analysis", icon: LineChart },
  callback: { label: "Callback", icon: Phone },
};

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-lio">
      <p className="display-num text-3xl leading-none text-foreground">{value}</p>
      <p className="label-uppercase mt-2 text-muted-foreground">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground/70">{sub}</p>}
    </div>
  );
}

function CustomerBadge({ isCustomer }: { isCustomer: boolean }) {
  return (
    <span
      className={`rounded-full px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${
        isCustomer ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
      }`}
    >
      {isCustomer ? "Customer" : "Prospect"}
    </span>
  );
}

export function AdminDashboard({ data }: { data: AdminData }) {
  const { totals, leaderboard, requests, participants } = data;
  const maxLeader = leaderboard[0]?.total || 1;

  return (
    <div className="min-h-dvh bg-background">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <LioLogo className="h-6 text-foreground" />
            <span className="label-uppercase hidden text-muted-foreground sm:block">
              Sales dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin/export"
              className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </a>
            <form action={exitAdmin}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" /> Exit
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <h1 className="text-3xl text-foreground">What the room did</h1>

        {/* stats */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="Attendees" value={formatInt(totals.participants)} />
          <Stat
            label="Built a set-up"
            value={formatInt(totals.withSetup)}
            sub={totals.participants ? `${Math.round((totals.withSetup / totals.participants) * 100)}% of attendees` : undefined}
          />
          <Stat label="Backed (room)" value={formatEur(totals.allocated)} />
          <Stat label="Requests" value={formatInt(totals.requests)} />
          <Stat label="Quiz plays" value={formatInt(totals.quizPlays)} />
        </section>

        {/* requests - the follow-up list */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="flex items-center gap-2 text-xl text-foreground">
              <Sparkles className="h-4 w-4 text-accent" /> Requests to follow up
            </h2>
            <div className="flex gap-2 text-xs text-muted-foreground">
              {Object.entries(totals.requestsByType).map(([t, n]) => (
                <span key={t}>
                  {REQ_META[t]?.label ?? t}: <span className="text-foreground">{n}</span>
                </span>
              ))}
            </div>
          </div>

          {requests.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-card/40 px-5 py-8 text-center text-sm text-muted-foreground">
              No requests yet.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {requests.map((r) => {
                const meta = REQ_META[r.type] ?? { label: r.type, icon: Sparkles };
                const Icon = meta.icon;
                return (
                  <article key={r.id} className="rounded-lg border border-border bg-card p-4 shadow-lio">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[1.02rem] leading-tight text-foreground">
                          {r.participant.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {r.participant.email}
                          {r.participant.company ? ` · ${r.participant.company}` : ""}
                        </p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent/12 px-2.5 py-1 text-xs font-medium text-accent">
                        <Icon className="h-3.5 w-3.5" /> {meta.label}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <CustomerBadge isCustomer={r.participant.isExistingCustomer} />
                      <span className="text-xs text-muted-foreground">
                        {formatEur(r.hardEur)}/yr · {r.ftes >= 10 ? Math.round(r.ftes) : r.ftes.toFixed(1)} FTE
                      </span>
                    </div>

                    {r.agents.length > 0 && (
                      <p className="mt-2 line-clamp-2 text-xs leading-snug text-muted-foreground">
                        {r.agents.map((a) => `${a.name} (${formatEur(a.amountEur)})`).join(" · ")}
                      </p>
                    )}
                    {r.note && (
                      <p className="mt-2 rounded bg-secondary/60 px-2.5 py-1.5 text-xs italic leading-snug text-foreground">
                        “{r.note}”
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <p className="text-[0.65rem] text-muted-foreground/70">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                      <RequestStatus id={r.id} status={r.status} />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* leaderboard */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl text-foreground">
            <Trophy className="h-4 w-4 text-accent" /> Most-backed agents
          </h2>
          {leaderboard.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-card/40 px-5 py-6 text-center text-sm text-muted-foreground">
              No allocations yet.
            </p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {leaderboard.slice(0, 12).map((row, i) => (
                <div
                  key={row.agentId}
                  data-agent={row.category}
                  className="relative overflow-hidden rounded-md border border-border bg-card px-3 py-2.5"
                >
                  <div className="absolute inset-y-0 left-0 bg-agent/8" style={{ width: `${(row.total / maxLeader) * 100}%` }} />
                  <div className="relative flex items-center gap-3">
                    <span className="display-num w-5 shrink-0 text-sm text-muted-foreground">{i + 1}</span>
                    <span className="shrink-0 rounded-full bg-agent/12 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider text-agent">
                      {CATEGORY_SHORT[row.category as keyof typeof CATEGORY_SHORT] ?? "·"}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">{row.name}</span>
                    <span className="flex shrink-0 items-center gap-1 text-[0.65rem] text-muted-foreground">
                      <Users className="h-3 w-3" /> {row.backers}
                    </span>
                    <span className="display-num shrink-0 text-sm tabular-nums text-agent">
                      {formatEur(row.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* participants table */}
        <section className="space-y-3">
          <h2 className="text-xl text-foreground">All attendees</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left">
                  <th className="px-3 py-2.5 font-medium text-muted-foreground">Name</th>
                  <th className="px-3 py-2.5 font-medium text-muted-foreground">Company</th>
                  <th className="px-3 py-2.5 font-medium text-muted-foreground">Type</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Agents</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Backed</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Savings/yr</th>
                  <th className="px-3 py-2.5 font-medium text-muted-foreground">Requests</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Quiz</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-2.5">
                      <p className="text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{p.company || "-"}</td>
                    <td className="px-3 py-2.5"><CustomerBadge isCustomer={p.isExistingCustomer} /></td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{p.agentsBacked}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatEur(p.allocated)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatEur(p.hardEur)}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {p.requestTypes.length ? p.requestTypes.map((t) => REQ_META[t]?.label ?? t).join(", ") : "-"}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                      {p.bestQuiz !== null ? formatEurFull(p.bestQuiz) : "-"}
                    </td>
                  </tr>
                ))}
                {participants.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                      No attendees yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
