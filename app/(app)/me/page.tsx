import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Sparkles,
  Trophy,
  ArrowRight,
  Pencil,
  LogOut,
  BadgeCheck,
} from "lucide-react";
import { getCurrentParticipant } from "@/lib/auth";
import { getSetupSnapshot } from "@/lib/funnel";
import { db } from "@/lib/db";
import { formatEur } from "@/lib/format";
import { CATEGORY_SHORT } from "@/lib/agents";
import { fmtPrize } from "@/lib/content/quiz";

export const metadata: Metadata = { title: "My set-up" };

export default async function MePage() {
  const p = await getCurrentParticipant();
  if (!p) redirect("/login");

  const [snapshot, quiz] = await Promise.all([
    getSetupSnapshot(p.id),
    db.quizResult.aggregate({
      where: { participantId: p.id },
      _max: { score: true },
      _count: { _all: true },
    }),
  ]);
  const bestScore = quiz._max.score;
  const plays = quiz._count._all;
  const hasSetup = snapshot.items.length > 0;
  const initials = p.name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8" data-agent="services">
      {/* profile */}
      <header className="lio-rise flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground">
          {initials || "·"}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl leading-tight text-foreground">{p.name}</h1>
          <p className="truncate text-sm text-muted-foreground">{p.email}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {p.company && <span className="text-xs text-muted-foreground">{p.company}</span>}
            {p.isExistingCustomer && (
              <span className="flex items-center gap-1 rounded-full bg-accent/15 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-accent">
                <BadgeCheck className="h-3 w-3" /> Customer
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ROI summary */}
      <section className="lio-rise lio-rise-1 lio-surface-light rounded-lg p-5" data-agent="s2c">
        <p className="label-uppercase text-muted-foreground">Your set-up</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <p className="display-num text-2xl leading-none text-agent">
              {formatEur(snapshot.allocated)}
            </p>
            <p className="label-uppercase mt-1 text-muted-foreground">Backed</p>
          </div>
          <div>
            <p className="display-num text-2xl leading-none text-agent">
              {formatEur(snapshot.hardEur)}
            </p>
            <p className="label-uppercase mt-1 text-muted-foreground">Savings/yr</p>
          </div>
          <div>
            <p className="display-num text-2xl leading-none text-agent">
              {snapshot.ftes >= 10 ? Math.round(snapshot.ftes) : snapshot.ftes.toFixed(1)}
            </p>
            <p className="label-uppercase mt-1 text-muted-foreground">FTEs</p>
          </div>
        </div>
      </section>

      {/* backed agents */}
      {hasSetup ? (
        <section className="lio-rise lio-rise-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-foreground">Your agents</h2>
            <Link href="/build" className="flex items-center gap-1 text-sm font-medium text-accent">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>
          </div>
          <div className="space-y-2">
            {snapshot.items.map((it) => (
              <Link
                key={it.agentId}
                href={`/agents/${it.agentId}`}
                data-agent={it.category}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2.5 shadow-lio transition-transform hover:-translate-y-0.5"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 rounded-full bg-agent/12 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider text-agent">
                    {CATEGORY_SHORT[it.category as keyof typeof CATEGORY_SHORT] ?? "·"}
                  </span>
                  <span className="truncate text-sm text-foreground">{it.name}</span>
                </span>
                <span className="display-num shrink-0 text-sm tabular-nums text-agent">
                  {formatEur(it.amountEur)}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.99]"
          >
            Request a demo or offer <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <section className="lio-rise lio-rise-2 rounded-lg border border-dashed border-border bg-card/40 px-5 py-8 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            You haven&apos;t built a set-up yet.
          </p>
          <Link href="/build" className="mt-2 inline-block text-sm font-medium text-accent">
            Spend your €1M →
          </Link>
        </section>
      )}

      {/* quiz */}
      <section className="lio-rise lio-rise-3">
        <Link
          href="/millionaire"
          data-agent="p2s"
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 shadow-lio"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-agent/10 text-agent">
              <Trophy className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm text-foreground">Wer wird Millionär</span>
              <span className="block text-xs text-muted-foreground">
                {bestScore != null ? `Best: ${fmtPrize(bestScore)} · ${plays} play${plays === 1 ? "" : "s"}` : "Not played yet"}
              </span>
            </span>
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </section>

      {/* logout */}
      <form action="/api/auth/logout" method="post" className="lio-rise lio-rise-4 pt-2">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </form>
    </div>
  );
}
