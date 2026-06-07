"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { Agent, Metric } from "@/lib/agents";
import { CATEGORY_LABEL, CATEGORY_ORDER, CATEGORY_SHORT } from "@/lib/agents";
import { hasCalculator } from "@/lib/calculators";
import { RoiCalculator } from "./roi-calculator";
import { cn } from "@/lib/utils";

interface Stop {
  key: "agent" | "business" | "case" | "deep";
  label: string;
}

export function AgentDetail({ agent }: { agent: Agent }) {
  const stops: Stop[] = [{ key: "agent", label: "Agent" }];
  if (agent.businessCase) stops.push({ key: "business", label: "Business Case" });
  if (agent.caseStudy) stops.push({ key: "case", label: "Case Study" });
  if (agent.deepDive)
    stops.push({ key: "deep", label: agent.deepDive.tabLabel || "Deep Dive" });

  const [active, setActive] = useState(0);
  const stop = stops[active];

  return (
    <div data-agent={agent.category} className="-mt-1">
      {/* top chrome */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href="/agents"
          className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="label-uppercase">Booklet</span>
        </Link>
        <span className="lio-chip">{CATEGORY_SHORT[agent.category]}</span>
      </div>

      {/* stop navigator */}
      <div className="no-scrollbar -mx-4 mb-7 flex gap-5 overflow-x-auto px-4">
        {stops.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActive(i)}
            className="group flex shrink-0 items-center gap-2 py-1"
            aria-current={i === active}
          >
            <span
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active
                  ? "w-8 bg-agent shadow-[0_0_12px_hsl(var(--agent)/0.6)]"
                  : "w-2 bg-border group-hover:bg-muted-foreground",
              )}
            />
            <span
              className={cn(
                "label-uppercase whitespace-nowrap transition-colors",
                i === active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* stop content */}
      <div key={stop.key} className="lio-slide-enter">
        {stop.key === "agent" && <IntroStop agent={agent} />}
        {stop.key === "business" && <BusinessStop agent={agent} />}
        {stop.key === "case" && <CaseStop agent={agent} />}
        {stop.key === "deep" && <DeepStop agent={agent} />}
      </div>

      {/* pager */}
      <div className="mt-9 flex items-center justify-between gap-3 border-t border-border pt-4">
        <button
          onClick={() => setActive((a) => Math.max(0, a - 1))}
          disabled={active === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:invisible"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <span className="display-num text-sm tabular-nums text-muted-foreground">
          {active + 1} / {stops.length}
        </span>
        {active < stops.length - 1 ? (
          <button
            onClick={() => setActive((a) => a + 1)}
            className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform active:scale-95"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href={`/build?agent=${agent.id}`}
            className="flex items-center gap-1.5 rounded-md bg-agent px-4 py-2 text-sm font-medium text-agent-foreground transition-transform active:scale-95"
          >
            <Sparkles className="h-4 w-4" /> Add to set-up
          </Link>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- Stops --------------------------------- */

function MetricRow({ items }: { items: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      {items.map((m, i) => (
        <div key={i}>
          <p className="display-num text-2xl leading-none text-agent">{m.value}</p>
          <p className="label-uppercase mt-1.5 text-muted-foreground">{m.label}</p>
          {m.sub && <p className="mt-0.5 text-xs text-muted-foreground/80">{m.sub}</p>}
        </div>
      ))}
    </div>
  );
}

function IntroStop({ agent }: { agent: Agent }) {
  const chapter = String(CATEGORY_ORDER.indexOf(agent.category) + 1).padStart(2, "0");
  return (
    <div className="space-y-7">
      <div className="lio-rise">
        <p className="label-uppercase mb-3 text-agent">{CATEGORY_LABEL[agent.category]}</p>
        <h1 className="text-4xl leading-[1.05] text-foreground">{agent.name}</h1>
        <p className="mt-3 text-base leading-relaxed text-foreground/80">{agent.tagline}</p>
      </div>

      {/* chapter plate */}
      <div className="lio-stage lio-rise lio-rise-1 relative flex h-36 items-center justify-between overflow-hidden rounded-lg border border-agent/20 px-6">
        <div>
          <p className="display-num text-6xl leading-none text-agent/90">{chapter}</p>
          <p className="label-uppercase mt-1 text-muted-foreground">Chapter</p>
        </div>
        <p className="label-uppercase rotate-0 text-right text-[0.6rem] text-muted-foreground/60">
          Lio ·<br />Agentic World
        </p>
      </div>

      <p className="lio-rise lio-rise-2 text-sm leading-relaxed text-muted-foreground">
        {agent.intro.description}
      </p>

      {agent.intro.flow?.length > 0 && (
        <div className="lio-rise lio-rise-2">
          <p className="label-uppercase mb-3 text-muted-foreground">Flow</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            {agent.intro.flow.map((step, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-foreground">
                  {step}
                </span>
                {i < agent.intro.flow.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-agent" />
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {agent.intro.impact?.length > 0 && (
        <div className="lio-rise lio-rise-3 border-t border-border pt-6">
          <MetricRow items={agent.intro.impact} />
        </div>
      )}
    </div>
  );
}

function BusinessStop({ agent }: { agent: Agent }) {
  const bc = agent.businessCase;
  if (!bc) return null;
  const calc = bc.calculator;
  return (
    <div className="space-y-7">
      {calc?.headline && (
        <h2 className="lio-rise text-2xl leading-tight text-foreground">{calc.headline}</h2>
      )}

      {bc.valueDrivers?.length > 0 && (
        <div className="lio-rise lio-rise-1">
          <MetricRow items={bc.valueDrivers} />
        </div>
      )}

      {calc && hasCalculator(agent.id) && (
        <div className="lio-rise lio-rise-2 border-t border-border pt-6">
          <RoiCalculator agentId={agent.id} inputs={calc.inputs} />
        </div>
      )}

      {bc.rationale && (
        <p className="lio-rise lio-rise-3 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
          {bc.rationale}
        </p>
      )}
    </div>
  );
}

function CaseStop({ agent }: { agent: Agent }) {
  const cs = agent.caseStudy;
  if (!cs) return null;
  return (
    <div className="space-y-7">
      <div className="lio-rise">
        <p className="label-uppercase mb-2 text-agent">Case study</p>
        <h2 className="text-2xl leading-tight text-foreground">{cs.client}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{cs.clientMeta}</p>
      </div>

      {/* outcome plate */}
      <div className="lio-surface-light lio-rise lio-rise-1 rounded-lg p-6">
        <p className="label-uppercase text-muted-foreground">Outcome</p>
        <p className="display-num mt-2 text-4xl leading-none text-agent">{cs.headline.value}</p>
        <p className="mt-2 text-sm text-foreground">{cs.headline.label}</p>
        {cs.headline.sub && <p className="mt-1 text-xs text-muted-foreground">{cs.headline.sub}</p>}

        {cs.stats?.length > 0 && (
          <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4">
            {cs.stats.map((s, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="display-num text-sm tabular-nums text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {cs.quote && (
        <figure className="lio-rise lio-rise-2 lio-accent-rail pl-5">
          <blockquote className="text-base leading-relaxed text-foreground/90">
            &ldquo;{cs.quote.text}&rdquo;
          </blockquote>
          <figcaption className="mt-2 text-xs text-muted-foreground">- {cs.quote.role}</figcaption>
        </figure>
      )}

      <Link
        href={`/checkout?intent=demo&agent=${agent.id}`}
        className="lio-rise lio-rise-3 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-95"
      >
        Book a demo of this agent
      </Link>
    </div>
  );
}

function DeepStop({ agent }: { agent: Agent }) {
  const dd = agent.deepDive;
  if (!dd) return null;
  return (
    <div className="space-y-6">
      <div className="lio-rise">
        <p className="label-uppercase mb-2 text-agent">{dd.tabLabel}</p>
        <h2 className="text-2xl leading-tight text-foreground">{dd.header}</h2>
        {dd.subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{dd.subtitle}</p>
        )}
      </div>

      {dd.pockets?.length > 0 && (
        <div className="lio-rise lio-rise-1 grid gap-4 sm:grid-cols-2">
          {dd.pockets.map((p, i) => (
            <div key={i} className="rounded-md border border-border bg-card p-4 shadow-lio">
              <p className="display-num text-3xl leading-none text-agent">{p.value}</p>
              <p className="mt-2 text-sm text-foreground">{p.title}</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{p.context}</p>
              {p.source && (
                <p className="mt-2 text-[0.65rem] text-muted-foreground/70">{p.source}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {dd.calloutTitle && (
        <div className="lio-rise lio-rise-2 rounded-md bg-agent/10 px-4 py-3 text-sm font-medium text-foreground">
          {dd.calloutTitle}
        </div>
      )}
    </div>
  );
}
