"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  SlidersHorizontal,
  ArrowRight,
  Users,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { getAgent, CATEGORY_SHORT } from "@/lib/agents";
import {
  roiContribution,
  hoursToFte,
  defaultInputs,
  hasCalculator,
} from "@/lib/calculators";
import { formatEur, formatEurFull, formatInt, sliderValue, ONE_MILLION } from "@/lib/format";
import { RoiCalculator } from "@/components/agents/roi-calculator";
import { Slider } from "@/components/ui/slider";
import { AddAgentsSheet } from "./add-agents-sheet";
import { saveAllocation, removeAllocation } from "@/app/(app)/build/actions";
import type { SavedAllocation, LeaderboardRow } from "@/lib/funnel";
import { cn } from "@/lib/utils";

interface Item {
  agentId: string;
  amountEur: number;
  inputs: Record<string, number>;
}

const STEP = 25_000;

export function Funnel({
  initial,
  leaderboard,
  autoAddAgentId,
}: {
  initial: SavedAllocation[];
  leaderboard: LeaderboardRow[];
  autoAddAgentId?: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(() => {
    const base: Item[] = initial.map((s) => ({
      agentId: s.agentId,
      amountEur: s.amountEur,
      inputs: s.inputs ?? defaultInputs(s.agentId),
    }));
    // Deep-link /build?agent=X: seed it into the initial set-up (persisted below).
    if (
      autoAddAgentId &&
      getAgent(autoAddAgentId) &&
      !base.some((i) => i.agentId === autoAddAgentId)
    ) {
      const cur = base.reduce((sum, i) => sum + i.amountEur, 0);
      base.push({
        agentId: autoAddAgentId,
        amountEur: Math.min(100_000, Math.max(0, ONE_MILLION - cur)),
        inputs: defaultInputs(autoAddAgentId),
      });
    }
    return base;
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const allocated = items.reduce((s, i) => s + i.amountEur, 0);
  const balance = Math.max(0, ONE_MILLION - allocated);
  const inSetup = useMemo(() => new Set(items.map((i) => i.agentId)), [items]);

  const roi = useMemo(() => {
    let hardEur = 0;
    let hours = 0;
    for (const it of items) {
      const c = roiContribution(it.agentId, it.inputs);
      hardEur += c.hardEur;
      hours += c.hoursPerYear;
    }
    return { hardEur, hours, ftes: hoursToFte(hours) };
  }, [items]);

  // Debounced autosave per agent.
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const persist = useCallback(
    (agentId: string, amountEur: number, inputs: Record<string, number>) => {
      const existing = timers.current.get(agentId);
      if (existing) clearTimeout(existing);
      timers.current.set(
        agentId,
        setTimeout(() => {
          void saveAllocation(agentId, amountEur, JSON.stringify(inputs)).catch(() => {});
        }, 450),
      );
    },
    [],
  );

  // Immediate, reliable save (on slider release / explicit commit) - flushes any
  // pending debounce so the final value always lands.
  const flush = useCallback(
    (agentId: string, amountEur: number, inputs: Record<string, number>) => {
      const t = timers.current.get(agentId);
      if (t) clearTimeout(t);
      timers.current.delete(agentId);
      void saveAllocation(agentId, amountEur, JSON.stringify(inputs))
        .then(() => router.refresh()) // refresh header balance + room leaderboard
        .catch(() => {});
    },
    [router],
  );

  const addAgent = useCallback(
    (agentId: string) => {
      setItems((prev) => {
        if (prev.some((i) => i.agentId === agentId)) return prev;
        const cur = prev.reduce((s, i) => s + i.amountEur, 0);
        const amount = Math.min(100_000, Math.max(0, ONE_MILLION - cur));
        const inputs = defaultInputs(agentId);
        persist(agentId, amount, inputs);
        return [...prev, { agentId, amountEur: amount, inputs }];
      });
    },
    [persist],
  );

  const removeAgent = useCallback(
    (agentId: string) => {
      const t = timers.current.get(agentId);
      if (t) clearTimeout(t);
      setItems((prev) => prev.filter((i) => i.agentId !== agentId));
      setExpanded((e) => (e === agentId ? null : e));
      void removeAllocation(agentId)
        .then(() => router.refresh())
        .catch(() => {});
    },
    [router],
  );

  const setAmount = useCallback(
    (agentId: string, amountEur: number) => {
      setItems((prev) => {
        const next = prev.map((i) =>
          i.agentId === agentId ? { ...i, amountEur } : i,
        );
        const it = next.find((i) => i.agentId === agentId);
        if (it) persist(agentId, it.amountEur, it.inputs);
        return next;
      });
    },
    [persist],
  );

  const setInputs = useCallback(
    (agentId: string, inputs: Record<string, number>) => {
      setItems((prev) => {
        const next = prev.map((i) => (i.agentId === agentId ? { ...i, inputs } : i));
        const it = next.find((i) => i.agentId === agentId);
        if (it) persist(agentId, it.amountEur, it.inputs);
        return next;
      });
    },
    [persist],
  );

  // Persist the deep-link auto-added agent once (it's seeded into initial state
  // above; here we only sync it to the DB - no setState in the effect).
  useEffect(() => {
    if (!autoAddAgentId || !getAgent(autoAddAgentId)) return;
    if (initial.some((s) => s.agentId === autoAddAgentId)) return; // already existed
    const it = items.find((i) => i.agentId === autoAddAgentId);
    if (it) {
      void saveAllocation(autoAddAgentId, it.amountEur, JSON.stringify(it.inputs))
        .then(() => router.refresh())
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round((allocated / ONE_MILLION) * 100);

  return (
    <div className="space-y-8">
      <header className="lio-rise">
        <p className="label-uppercase mb-2 text-muted-foreground">Build your set-up</p>
        <h1 className="text-3xl leading-tight text-foreground">
          Spend your million. Shape your ROI.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You&apos;ve got €1,000,000 to back the procurement agents you believe in.
        </p>
      </header>

      {/* How it works - plain-language guide for first-timers */}
      <section
        className="lio-rise lio-rise-1 rounded-lg border border-border bg-card p-5 shadow-lio"
        data-agent="s2c"
      >
        <p className="label-uppercase mb-4 text-muted-foreground">How it works</p>
        <ol className="space-y-3.5">
          {[
            [
              "Back what you'd deploy",
              "Spend your €1,000,000 on the agents you'd actually put to work - the more you back one, the stronger your vote for it.",
            ],
            [
              "Watch the ROI, live",
              "Your set-up models the yearly hard savings and the FTEs it would free up, updating as you go.",
            ],
            [
              "Send it to our team",
              "Happy with your set-up? Request a demo and we follow up on exactly the agents you picked.",
            ],
          ].map(([title, body], i) => (
            <li key={i} className="flex gap-3">
              <span className="display-num flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-agent/12 text-xs text-agent">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm leading-tight text-foreground">{title}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Budget meter */}
      <div className="lio-rise lio-rise-1 rounded-lg border border-border bg-card p-5 shadow-lio" data-agent="s2c">
        <div className="flex items-baseline justify-between">
          <span className="label-uppercase text-muted-foreground">Allocated</span>
          <span className="text-xs text-muted-foreground">
            {formatEurFull(balance)} left
          </span>
        </div>
        <p className="display-num mt-1 text-3xl text-foreground">
          {formatEurFull(allocated)}
          <span className="text-base text-muted-foreground"> / {formatEur(ONE_MILLION)}</span>
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-agent transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Live ROI */}
      <div className="lio-rise lio-rise-2 lio-surface-light rounded-lg p-5" data-agent="p2p">
        <div className="flex items-center justify-between">
          <span className="label-uppercase text-muted-foreground">
            Indicative annual impact
          </span>
          <span className="flex items-center gap-1.5 text-[0.62rem] font-medium tracking-wide text-agent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-agent" /> Live
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4" aria-live="polite" aria-atomic="true">
          <div>
            <p className="display-num text-3xl leading-none text-agent">
              {formatEur(roi.hardEur)}
            </p>
            <p className="label-uppercase mt-1.5 text-muted-foreground">Hard savings / yr</p>
          </div>
          <div>
            <p className="display-num text-3xl leading-none text-agent">
              {roi.ftes >= 10 ? Math.round(roi.ftes) : roi.ftes.toFixed(1)}
            </p>
            <p className="label-uppercase mt-1.5 text-muted-foreground">FTEs freed</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {items.length === 0
            ? "Add agents below to model your impact."
            : `Across ${items.length} agent${items.length > 1 ? "s" : ""} · ~${formatInt(roi.hours)} hours freed per year.`}
        </p>
      </div>

      {/* Set-up list */}
      <section className="space-y-3">
        <h2 className="text-lg text-foreground">Your set-up</h2>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/40 px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing backed yet - tap <span className="text-foreground">Add agents</span> below to start spending your €1,000,000.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => {
              const agent = getAgent(it.agentId);
              if (!agent) return null;
              const maxForRow = ONE_MILLION - (allocated - it.amountEur);
              const isOpen = expanded === it.agentId;
              const canTune = hasCalculator(agent.id) && agent.businessCase?.calculator;
              const contrib = roiContribution(it.agentId, it.inputs);
              return (
                <div
                  key={it.agentId}
                  data-agent={agent.category}
                  className="rounded-lg border border-border bg-card p-4 shadow-lio"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded-full bg-agent/12 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-agent">
                          {CATEGORY_SHORT[agent.category]}
                        </span>
                      </div>
                      <Link
                        href={`/agents/${agent.id}`}
                        className="text-[1.02rem] leading-tight text-foreground hover:text-agent"
                      >
                        {agent.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeAgent(it.agentId)}
                      aria-label={`Remove ${agent.name}`}
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* allocation slider */}
                  <div className="mt-3">
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">Backed with</span>
                      <span className="display-num text-lg tabular-nums text-agent">
                        {formatEur(it.amountEur)}
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={Math.max(STEP, Number.isFinite(maxForRow) ? maxForRow : ONE_MILLION)}
                      step={STEP}
                      value={[Number.isFinite(it.amountEur) ? it.amountEur : 0]}
                      onValueChange={(v) => setAmount(it.agentId, sliderValue(v))}
                      onValueCommitted={(v) => flush(it.agentId, sliderValue(v), it.inputs)}
                      aria-label={`Budget for ${agent.name}`}
                    />
                  </div>

                  {/* ROI contribution + tune toggle */}
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                    <span className="text-xs text-muted-foreground">
                      {contrib.hardEur > 0 && `${formatEur(contrib.hardEur)}/yr`}
                      {contrib.hardEur > 0 && contrib.hoursPerYear > 0 && " · "}
                      {contrib.hoursPerYear > 0 &&
                        `${hoursToFte(contrib.hoursPerYear).toFixed(1)} FTE`}
                      {contrib.hardEur === 0 && contrib.hoursPerYear === 0 && "-"}
                    </span>
                    {canTune && (
                      <button
                        onClick={() => setExpanded(isOpen ? null : it.agentId)}
                        className="flex items-center gap-1.5 text-xs font-medium text-agent"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        {isOpen ? "Hide ROI" : "Tune ROI"}
                      </button>
                    )}
                  </div>

                  {isOpen && canTune && (
                    <div className="mt-4 border-t border-border/60 pt-4">
                      <RoiCalculator
                        agentId={agent.id}
                        inputs={agent.businessCase!.calculator!.inputs}
                        values={it.inputs}
                        onChange={(v) => setInputs(it.agentId, v)}
                        compact
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <AddAgentsSheet inSetup={inSetup} onAdd={addAgent} onRemove={removeAgent} />
      </section>

      {/* Checkout CTA */}
      <Link
        href="/checkout"
        aria-disabled={items.length === 0}
        className={cn(
          "flex items-center justify-center gap-2 rounded-md px-4 py-3.5 text-sm font-medium transition-transform active:scale-[0.99]",
          items.length === 0
            ? "pointer-events-none bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground",
        )}
      >
        Review &amp; request a demo
        <ArrowRight className="h-4 w-4" />
      </Link>

      {/* Room leaderboard */}
      <section className="space-y-3 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg text-foreground">
            <Trophy className="h-4 w-4 text-accent" /> What the room is backing
          </h2>
          <button
            onClick={() => router.refresh()}
            aria-label="Refresh leaderboard"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <Leaderboard rows={leaderboard} />
      </section>
    </div>
  );
}

function Leaderboard({ rows }: { rows: LeaderboardRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-card/40 px-5 py-6 text-center text-sm text-muted-foreground">
        No votes yet - be the first to back an agent.
      </p>
    );
  }
  const max = rows[0]?.total || 1;
  return (
    <div className="space-y-2">
      {rows.map((r, i) => {
        const agent = getAgent(r.agentId);
        if (!agent) return null;
        return (
          <div
            key={r.agentId}
            data-agent={agent.category}
            className="relative overflow-hidden rounded-md border border-border bg-card px-3 py-2.5"
          >
            <div
              className="absolute inset-y-0 left-0 bg-agent/8"
              style={{ width: `${Math.max(4, (r.total / max) * 100)}%` }}
            />
            <div className="relative flex items-center gap-3">
              <span className="display-num w-5 shrink-0 text-sm text-muted-foreground">
                {i + 1}
              </span>
              <Link
                href={`/agents/${agent.id}`}
                className="min-w-0 flex-1 truncate text-sm text-foreground hover:text-agent"
              >
                {agent.name}
              </Link>
              <span className="flex shrink-0 items-center gap-1 text-[0.65rem] text-muted-foreground">
                <Users className="h-3 w-3" />
                {r.backers}
              </span>
              <span className="display-num shrink-0 text-sm tabular-nums text-agent">
                {formatEur(r.total)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
