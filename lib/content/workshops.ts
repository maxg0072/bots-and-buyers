/* =============================================================================
   WORKSHOPS  ✏️  PLACEHOLDER CONTENT - replace `WORKSHOPS` with the real list.
   Set `WORKSHOPS_IS_PLACEHOLDER = false` once final to hide the sample banner.
   ============================================================================= */

export interface Workshop {
  id: string;
  title: string;
  host?: string;
  room?: string;
  time?: string;
  /** Maps to an agent category accent: services|srm|p2p|s2c|p2s|others */
  accent?: "services" | "srm" | "p2p" | "s2c" | "p2s" | "others";
  summary: string;
  topics: string[];
}

export const WORKSHOPS_IS_PLACEHOLDER = true;

export const WORKSHOPS: Workshop[] = [
  {
    id: "w1",
    title: "Guided Buying in the wild",
    host: "Lio Solutions",
    room: "Room A",
    time: "11:00 & 14:15",
    accent: "p2p",
    summary:
      "Bring compliant purchasing to every employee in the tools they already use - and watch maverick spend collapse.",
    topics: ["Catalog adoption", "Teams & email intake", "Compliance by design"],
  },
  {
    id: "w2",
    title: "Agentic sourcing & negotiation",
    host: "Lio Solutions",
    room: "Room B",
    time: "11:00 & 14:15",
    accent: "s2c",
    summary:
      "From RfX to award - how agents run sourcing events end-to-end and recover hard savings on tail spend.",
    topics: ["Tail-spend negotiation", "Scenario building", "Auctions"],
  },
  {
    id: "w3",
    title: "Supplier lifecycle, automated",
    host: "Lio Solutions",
    room: "Room C",
    time: "11:00 & 14:15",
    accent: "srm",
    summary:
      "Onboard and manage suppliers end-to-end with agentic workflows - no portal required.",
    topics: ["Onboarding", "Risk & compliance", "Master data"],
  },
  {
    id: "w4",
    title: "From spend data to strategy",
    host: "Lio Solutions",
    room: "Room A",
    time: "14:15",
    accent: "p2s",
    summary:
      "Turn historical spend into living category strategies - analytics, planning and execution by agents.",
    topics: ["Spend analytics", "Strategy creation", "Execution"],
  },
  {
    id: "w5",
    title: "Scaling agents across your org",
    host: "Lio Forward Deployed Engineers",
    room: "Room B",
    time: "14:15",
    accent: "services",
    summary:
      "Build custom agents and operating procedures - how teams roll Lio out across thousands of buyers.",
    topics: ["Agent Builder (AOPs)", "Integrations (SAP, Coupa)", "Change management"],
  },
];
