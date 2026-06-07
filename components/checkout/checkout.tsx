"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CalendarCheck,
  ReceiptText,
  LineChart,
  Phone,
  Check,
  ArrowLeft,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import type { SetupSnapshot } from "@/lib/funnel";
import { formatEur, formatEurFull } from "@/lib/format";
import { CATEGORY_SHORT } from "@/lib/agents";
import { createCheckoutRequest } from "@/app/(app)/checkout/actions";
import { cn } from "@/lib/utils";

type ReqType = "demo" | "offer" | "analysis" | "callback";

const OPTIONS: {
  type: ReqType;
  label: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  { type: "demo", label: "Book a demo", desc: "See your set-up live with a Lio expert.", icon: CalendarCheck },
  { type: "offer", label: "Request an offer", desc: "Get pricing for the agents you backed.", icon: ReceiptText },
  { type: "analysis", label: "Agentic analysis", desc: "Let Lio analyze your spend for opportunities.", icon: LineChart },
  { type: "callback", label: "Talk to us", desc: "A quick call when it suits you.", icon: Phone },
];

const LABEL: Record<ReqType, string> = {
  demo: "demo",
  offer: "offer",
  analysis: "agentic analysis",
  callback: "callback",
};

const LIO_COLORS = ["#659F9D", "#BB9681", "#447279", "#DC9D09", "#0A1624"];

function celebrate() {
  try {
    confetti({ particleCount: 90, spread: 72, origin: { y: 0.28 }, colors: LIO_COLORS });
    setTimeout(
      () => confetti({ particleCount: 55, spread: 100, scalar: 0.9, origin: { y: 0.32 }, colors: LIO_COLORS }),
      160,
    );
  } catch {
    /* confetti is best-effort */
  }
}

export function Checkout({
  snapshot,
  email,
  initialIntent,
  extraAgentId,
  extraAgentName,
}: {
  snapshot: SetupSnapshot;
  email: string;
  initialIntent?: string;
  extraAgentId?: string;
  extraAgentName?: string;
}) {
  const validInitial = OPTIONS.find((o) => o.type === initialIntent)?.type;
  const [selected, setSelected] = useState<ReqType>(validInitial ?? "demo");
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<ReqType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasSetup = snapshot.items.length > 0;

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await createCheckoutRequest({ type: selected, note, extraAgentId });
      if (res.ok) {
        setDone(selected);
        celebrate();
      } else setError(res.error ?? "Something went wrong.");
    });
  }

  if (done) {
    return (
      <div className="lio-rise flex flex-col items-center py-10 text-center" data-agent="p2p">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-agent/12 text-agent">
          <PartyPopper className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-3xl text-foreground">Request sent</h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Your {LABEL[done]} request is in. The Lio team will follow up at{" "}
          <span className="text-foreground">{email}</span>.
        </p>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
          <button
            onClick={() => {
              setDone(null);
              setNote("");
            }}
            className="rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Request something else
          </button>
          <Link
            href="/"
            className="rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-agent="s2c">
      <header className="lio-rise">
        <Link
          href="/build"
          className="mb-4 flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="label-uppercase">Set-up</span>
        </Link>
        <h1 className="text-3xl leading-tight text-foreground">Send it to your team</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          One tap and the Lio team picks it up - with your set-up and ROI attached.
        </p>
      </header>

      {/* Set-up recap */}
      {hasSetup ? (
        <section className="lio-rise lio-rise-1 lio-surface-light rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="label-uppercase text-muted-foreground">Your set-up</span>
            <span className="text-xs text-muted-foreground">
              {formatEurFull(snapshot.allocated)} backed
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4 border-b border-border/60 pb-4">
            <div>
              <p className="display-num text-2xl leading-none text-agent">
                {formatEur(snapshot.hardEur)}
              </p>
              <p className="label-uppercase mt-1 text-muted-foreground">Hard savings / yr</p>
            </div>
            <div>
              <p className="display-num text-2xl leading-none text-agent">
                {snapshot.ftes >= 10 ? Math.round(snapshot.ftes) : snapshot.ftes.toFixed(1)}
              </p>
              <p className="label-uppercase mt-1 text-muted-foreground">FTEs freed</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {snapshot.items.map((it) => (
              <li key={it.agentId} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 rounded-full bg-agent/12 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider text-agent">
                    {CATEGORY_SHORT[it.category as keyof typeof CATEGORY_SHORT] ?? "·"}
                  </span>
                  <span className="truncate text-sm text-foreground">{it.name}</span>
                </span>
                <span className="display-num shrink-0 text-sm tabular-nums text-muted-foreground">
                  {formatEur(it.amountEur)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="lio-rise lio-rise-1 rounded-lg border border-dashed border-border bg-card/40 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            {extraAgentName
              ? `You're requesting about the ${extraAgentName}.`
              : "You haven't built a set-up yet - that's fine, you can still request below."}
          </p>
          <Link href="/build" className="mt-2 inline-block text-sm font-medium text-agent">
            Build your set-up →
          </Link>
        </section>
      )}

      {/* Request type */}
      <section className="lio-rise lio-rise-2 space-y-3">
        <h2 className="text-lg text-foreground">What would you like?</h2>
        <div className="grid grid-cols-2 gap-3">
          {OPTIONS.map(({ type, label, desc, icon: Icon }) => {
            const active = selected === type;
            return (
              <button
                key={type}
                onClick={() => setSelected(type)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col gap-2 rounded-md border p-4 text-left transition-all",
                  active
                    ? "border-agent bg-agent/8 shadow-lio"
                    : "border-border bg-card hover:border-agent/40",
                )}
              >
                <span className="flex items-center justify-between">
                  <Icon className={cn("h-5 w-5", active ? "text-agent" : "text-muted-foreground")} />
                  {active && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-agent text-agent-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </span>
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-xs leading-snug text-muted-foreground">{desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Note */}
      <section className="lio-rise lio-rise-3">
        <label htmlFor="note" className="label-uppercase mb-2 block text-muted-foreground">
          Anything to add? <span className="normal-case tracking-normal opacity-60">· optional</span>
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Timing, specific use cases, who else should join…"
          className="w-full resize-none rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-agent"
        />
      </section>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <button
        onClick={submit}
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3.5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.99] disabled:opacity-60"
      >
        {pending ? "Sending…" : `Send ${OPTIONS.find((o) => o.type === selected)?.label.toLowerCase()} request`}
      </button>
      <p className="-mt-4 text-center text-xs text-muted-foreground">
        Sent to the Lio team · we&apos;ll reply to {email}
      </p>
    </div>
  );
}
