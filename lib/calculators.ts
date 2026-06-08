import { formatEur, formatInt } from "./format";
import { getAgent } from "./agents";

/* =============================================================================
   ROI calculators - ported 1:1 from the original "Agentic World" bundle.
   Each fn takes the slider values keyed by input id and returns display rows.
   ============================================================================= */

export interface CalcOutput {
  label: string;
  value: number;
  unit?: string;
  display: string;
  highlight?: boolean;
}

export type CalcFn = (v: Record<string, number>) => CalcOutput[];

const U = formatEur;
const oC = (n: number) => formatInt(n);
const rC = (n: number) => `~${formatInt(n)} h/wk`;

/** The shared "hours freed per FTE" pattern used by many operational agents. */
function hoursFreed(v: Record<string, number>): CalcOutput[] {
  const t = v.current * (v.reduction / 100);
  const n = t * v.ftes;
  return [
    { label: "Hours freed per week, per FTE", value: t, unit: "h", highlight: true, display: `~${t.toFixed(1)} h/wk` },
    { label: "Team total per week", value: n, unit: "h", display: `~${Math.round(n)} h/wk` },
    { label: "Team total per month", value: n * 4.33, unit: "h", display: `~${Math.round(n * 4.33)} h/mo` },
    { label: "Team total per year", value: n * 46, unit: "h", display: `~${Math.round(n * 46).toLocaleString("en-US")} h/yr` },
  ];
}

export const CALCULATORS: Record<string, CalcFn> = {
  "guided-buying": (v) => {
    const t = v.maverick * 0.75 * (v.savingsRate / 100);
    return [
      { label: "Maverick share recaptured", value: 75, unit: "%", display: "75%" },
      { label: "Hard savings p.a.", value: t, unit: "€", highlight: true, display: U(t) },
    ];
  },
  "pr-review": hoursFreed,
  "order-confirmation": hoursFreed,
  "order-bundling-agent": (v) => {
    const t = v.spend * 0.6;
    const n = t * (v.rate / 100);
    return [
      { label: "Bundleable Purchase Order volume (~60% share)", value: t, unit: "€", display: U(t) },
      { label: "Applied bundling rate", value: v.rate, unit: "%", display: `${v.rate}%` },
      { label: "Bundling savings per year", value: n, unit: "€", highlight: true, display: U(n) },
    ];
  },
  "tracking-agent": hoursFreed,
  "goods-receipt": (v) => {
    const t = v.current * (v.reduction / 100);
    const n = t * v.ftes;
    const r = v.blocked * 18;
    return [
      { label: "Hours freed per week, per FTE", value: t, unit: "h", highlight: true, display: `~${t.toFixed(1)} h/wk` },
      { label: "Team total per week", value: n, unit: "h", display: `~${Math.round(n)} h/wk` },
      { label: "Team total per year", value: n * 46, unit: "h", display: `~${Math.round(n * 46).toLocaleString("en-US")} h/yr` },
      { label: "AP rework avoided p.a.", value: r, unit: "€", display: U(r) },
    ];
  },
  "invoice-agent": hoursFreed,
  "agent-bpo": (v) => {
    const t = v.contractValue * 0.93;
    return [
      { label: "Lio cost ratio", value: 7, unit: "%", display: "7%" },
      { label: "Annual cost savings", value: t, unit: "€", highlight: true, display: U(t) },
    ];
  },
  "supplier-onboarding": hoursFreed,
  "agentic-srm": hoursFreed,
  "strategic-sourcing-hub": (v) => {
    const t = v.spend * 0.042;
    const n = v.events * v.daysPerEvent * 0.65;
    return [
      { label: "Hard savings p.a.", value: t, unit: "€", highlight: true, display: U(t) },
      { label: "Days freed for strategic work", value: n, unit: "d", display: `${oC(n)} d` },
    ];
  },
  "sourcing-agent": (v) => {
    const t = v.tailSpend * (v.coverage / 100) * (v.rate / 100);
    return [{ label: "Hard savings p.a.", value: t, unit: "€", highlight: true, display: U(t) }];
  },
  "negotiation-prep": hoursFreed,
  "tail-spend-negotiation": (v) => {
    const t = v.tail * (v.coverage / 100) * (v.rate / 100);
    return [{ label: "Hard savings p.a.", value: t, unit: "€", highlight: true, display: U(t) }];
  },
  "rfx-creation": (v) => {
    const n = v.events * 12;
    return [
      { label: "Days saved per event (Lio benchmark)", value: 12, unit: "d", display: "12 d" },
      { label: "Days freed per year", value: n, unit: "d", highlight: true, display: `~${Math.round(n).toLocaleString("en-US")} d` },
    ];
  },
  "supplier-selection": (v) => {
    const n = v.spend * 0.021;
    return [
      { label: "Lio blended uplift (depth)", value: 2.1, unit: "%", display: "2.1%" },
      { label: "Additional savings per year", value: n, unit: "€", highlight: true, display: U(n) },
    ];
  },
  "supplier-sourcing": (v) => {
    const n = 11 * v.ftes;
    const o = v.spend * (1.4 / 100);
    return [
      { label: "Hours/week freed per FTE (Lio benchmark)", value: 11, unit: "h", display: "11 h" },
      { label: "Team hours back per week", value: n, unit: "h", highlight: true, display: `~${Math.round(n)} h/wk` },
      { label: "Additional savings per year (×1.4% blended uplift)", value: o, unit: "€", highlight: true, display: U(o) },
    ];
  },
  "agentic-auctions": (v) => {
    const n = v.spend * 0.024;
    return [
      { label: "Lio blended auction uplift", value: 2.4, unit: "%", display: "2.4%" },
      { label: "Additional savings per year", value: n, unit: "€", highlight: true, display: U(n) },
    ];
  },
  "agentic-scenario-building": (v) => {
    const n = v.events * 12;
    const r = n / 40;
    const a = v.spend * (1.7 / 100);
    return [
      { label: "Hours saved per event (8 scenarios × 90 min)", value: 12, unit: "h", display: "12 h" },
      { label: "Analyst hours freed per year", value: n, unit: "h", highlight: true, display: `~${Math.round(n).toLocaleString("en-US")} h ≈ ${r.toFixed(0)} analyst weeks` },
      { label: "Additional savings per year (×1.7% blended award uplift)", value: a, unit: "€", highlight: true, display: U(a) },
    ];
  },
  "agentic-tenders": (v) => {
    const t = v.spend * 0.015;
    return [
      { label: "Annual spend tendered", value: v.spend, display: U(v.spend) },
      { label: "Lio blended uplift", value: 1.5, unit: "%", display: "1.5%" },
      { label: "Additional savings per year", value: t, unit: "€", display: U(t), highlight: true },
    ];
  },
  "agentic-evaluation": (v) => {
    const t = v.events * 16;
    return [
      { label: "Evaluation events per year", value: v.events, display: `${v.events}` },
      { label: "Hours saved per event", value: 16, unit: "h", display: "16 h" },
      { label: "Analyst hours freed per year", value: t, unit: "h", display: `${t.toLocaleString("en-US")} h ≈ ${Math.round(t / 40)} analyst weeks`, highlight: true },
    ];
  },
  "agentic-opportunity-assessment": (v) => {
    const t = v.spend * 0.06;
    return [
      { label: "Annual procurement spend in scope", value: v.spend, display: U(v.spend) },
      { label: "Pipeline identified in assessment", value: 6, unit: "%", display: "6%" },
      { label: "Annual value identified", value: t, unit: "€", display: U(t), highlight: true },
    ];
  },
  "contract-creation": (v) => {
    const t = v.contracts * 6;
    return [
      { label: "Contracts per year", value: v.contracts, display: `${v.contracts.toLocaleString("en-US")}` },
      { label: "Hours saved per contract", value: 6, unit: "h", display: "6 h" },
      { label: "Hours freed per year", value: t, unit: "h", display: `${t.toLocaleString("en-US")} h`, highlight: true },
    ];
  },
  "contract-surveillance-agent": (v) => {
    const t = v.renewal * 0.08 * 0.85;
    const n = v.active * 0.15 * 0.045;
    return [
      { label: "Renewal savings opportunity", value: t, unit: "€", display: U(t) },
      { label: "Hidden savings opportunity", value: n, unit: "€", display: U(n) },
      { label: "Total opportunity p.a.", value: t + n, unit: "€", highlight: true, display: U(t + n) },
    ];
  },
  "spend-to-contract-agent": (v) => {
    const n = v.spend * 0.0375;
    return [
      { label: "Lio blended negotiated rate", value: 3.75, unit: "%", display: "3.75%" },
      { label: "Hard savings per year", value: n, unit: "€", highlight: true, display: U(n) },
    ];
  },
  "procurement-intelligence": (v) => {
    const t = v.spend * (v.rate / 100);
    return [{ label: "Savings opportunity identified", value: t, unit: "€", highlight: true, display: U(t) }];
  },
  "agentic-strategy-creation": (v) => {
    const t = v.spend * (v.uplift / 100);
    return [
      { label: "Applied uplift", value: v.uplift, unit: "%", display: `${v.uplift}%` },
      { label: "Additional savings per year", value: t, unit: "€", highlight: true, display: U(t) },
    ];
  },
  "agent-operating-procedures": (v) => {
    const t = v.buyers * 4.5;
    return [
      { label: "Hours freed per buyer per week", value: 4.5, unit: "h", display: "4.5 h" },
      { label: "Team hours freed per week", value: t, unit: "h", highlight: true, display: rC(t) },
    ];
  },
  "forward-deployed-engineers": (v) => {
    const t = (v.engagementCost / v.annualValue) * 12;
    const n = v.annualValue / v.engagementCost;
    return [
      { label: "Year-1 ROI", value: n, unit: "×", display: `${n.toFixed(1)}×` },
      { label: "Payback period", value: t, unit: "months", highlight: true, display: `${t < 1 ? "< 1" : t.toFixed(1)} months` },
    ];
  },
  "lio-assistant": (v) => {
    const t = v.buyers * 3;
    return [
      { label: "Buyers in your team", value: v.buyers, display: `${v.buyers}` },
      { label: "Hours freed per buyer per week", value: 3, unit: "h", display: "3 h" },
      { label: "Team hours freed per week", value: t, unit: "h", display: `${t.toLocaleString("en-US")} h/wk`, highlight: true },
    ];
  },
  "lio-operating-procedures": (v) => {
    const t = v.sops * 120000;
    return [
      { label: "SOPs to operationalize", value: v.sops, display: `${v.sops}` },
      { label: "Value per SOP automated", value: 120000, display: "€120k" },
      { label: "Annual value unlocked", value: t, unit: "€", display: U(t), highlight: true },
    ];
  },
};

/** Default slider values for an agent (from its calculator config). */
export function defaultInputs(agentId: string): Record<string, number> {
  const inputs = getAgent(agentId)?.businessCase?.calculator?.inputs ?? [];
  return Object.fromEntries(inputs.map((i) => [i.id, i.default]));
}

/** Run an agent's calculator. Falls back to default inputs. Null if none. */
export function runCalculator(
  agentId: string,
  values?: Record<string, number>,
): CalcOutput[] | null {
  const fn = CALCULATORS[agentId];
  if (!fn) return null;
  return fn(values ?? defaultInputs(agentId));
}

export function hasCalculator(agentId: string): boolean {
  return agentId in CALCULATORS;
}

export interface RoiContribution {
  hardEur: number;
  hoursPerYear: number;
}

/**
 * Indicative annual ROI contribution of one agent - used to aggregate the
 * funnel total. Heuristic: largest €-output = hard savings; hours/days outputs
 * → hours per year (days × 8). Not a precise financial model.
 */
export function roiContribution(
  agentId: string,
  values?: Record<string, number>,
): RoiContribution {
  const outs = runCalculator(agentId, values);
  if (!outs) return { hardEur: 0, hoursPerYear: 0 };
  let hardEur = 0;
  let hoursPerYear = 0;
  for (const o of outs) {
    // Guard a NaN/undefined output (e.g. a corrupted or missing slider input):
    // one NaN must not poison Math.max and turn the whole total into NaN.
    const v = Number.isFinite(o.value) ? o.value : 0;
    if (o.unit === "€") {
      hardEur = Math.max(hardEur, v);
    } else if (o.unit === "h") {
      if (/year|yr/i.test(o.label)) hoursPerYear = Math.max(hoursPerYear, v);
      else if (/per week|hours back|team hours/i.test(o.label))
        hoursPerYear = Math.max(hoursPerYear, v * 46);
    } else if (o.unit === "d") {
      hoursPerYear = Math.max(hoursPerYear, v * 8);
    }
  }
  return { hardEur, hoursPerYear };
}

/** Hours → full-time equivalents (1,840 productive hours / FTE / year). */
export const HOURS_PER_FTE_YEAR = 1840;
export function hoursToFte(hours: number): number {
  return Number.isFinite(hours) ? hours / HOURS_PER_FTE_YEAR : 0;
}
