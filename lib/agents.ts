import agentsData from "@/data/agents.json";

/* =============================================================================
   Agent catalog - the static content driving the booklet, voting and funnel.
   Types mirror the original "Agentic World" data model.
   ============================================================================= */

export type Category = "services" | "srm" | "p2p" | "s2c" | "p2s" | "others";

export const CATEGORY_ORDER: Category[] = [
  "services",
  "srm",
  "p2p",
  "s2c",
  "p2s",
  "others",
];

export const CATEGORY_LABEL: Record<Category, string> = {
  services: "Services",
  srm: "Agentic Supplier Relationship Management",
  p2p: "Agentic P2P",
  s2c: "Agentic S2C",
  p2s: "Agentic Plan-to-Strategy (P2S)",
  others: "Other",
};

/** Short label for compact UI (chips, nav). */
export const CATEGORY_SHORT: Record<Category, string> = {
  services: "Services",
  srm: "SRM",
  p2p: "P2P",
  s2c: "S2C",
  p2s: "P2S",
  others: "Other",
};

export const CATEGORY_DESC: Record<Category, string> = {
  services:
    "Forward Deployed Engineers and tooling to scale agents across your organization.",
  srm: "Onboard and manage suppliers end-to-end with agentic workflows.",
  p2p: "From request to payment - agents run the operational procurement cycle.",
  s2c: "From sourcing to contract - agents drive savings across every event.",
  p2s: "From spend data to strategy - agents analyze, plan and execute category strategy.",
  others:
    "Tenders, evaluation, contracts, assistants and the infrastructure that runs agents at scale.",
};

/** Category accent hex (for non-CSS contexts - charts, OG images, emails). */
export const CATEGORY_HEX: Record<Category, string> = {
  services: "#0A1624",
  srm: "#BB9681",
  p2p: "#659F9D",
  s2c: "#447279",
  p2s: "#DC9D09",
  others: "#525F6F",
};

export interface Metric {
  label: string;
  value: string;
  sub?: string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  default: number;
  step: number;
  format?: string;
}

export interface Intro {
  description: string;
  flow: string[];
  impact: Metric[];
}

export interface Calculator {
  headline: string;
  inputs: CalculatorInput[];
  formulaSource?: string;
}

export interface BusinessCase {
  valueDrivers: Metric[];
  calculator?: Calculator;
  rationale: string;
}

export interface CaseStudy {
  client: string;
  clientMeta: string;
  headline: { value: string; label: string; sub?: string };
  stats: { label: string; value: string }[];
  quote: { text: string; role: string };
}

export interface DeepDivePocket {
  title: string;
  value: string;
  context: string;
  source?: string;
}

export interface DeepDive {
  template: string;
  tabLabel: string;
  header: string;
  subtitle: string;
  pockets: DeepDivePocket[];
  calloutTitle?: string;
  [key: string]: unknown;
}

export interface Agent {
  id: string;
  name: string;
  category: Category;
  tagline: string;
  intro: Intro;
  businessCase?: BusinessCase;
  caseStudy?: CaseStudy;
  deepDive?: DeepDive;
}

export const AGENTS = agentsData as unknown as Agent[];

export const AGENTS_BY_ID: Record<string, Agent> = Object.fromEntries(
  AGENTS.map((a) => [a.id, a]),
);

export function getAgent(id: string): Agent | undefined {
  return AGENTS_BY_ID[id];
}

export function agentsInCategory(cat: Category): Agent[] {
  return AGENTS.filter((a) => a.category === cat);
}

/** The catalog grouped by category, in display order. */
export function catalog(): { category: Category; agents: Agent[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    agents: agentsInCategory(category),
  }));
}
