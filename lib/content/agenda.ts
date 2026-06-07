/* =============================================================================
   AGENDA - Bots & Buyers, 11 June 2026.  Times are 24h "HH:MM"; `kind` drives
   the styling. (`AGENDA_IS_PLACEHOLDER = false` → no sample banner.)
   ============================================================================= */

export type SessionKind =
  | "keynote"
  | "talk"
  | "demo"
  | "workshop"
  | "break"
  | "networking";

export interface AgendaSession {
  id: string;
  start: string;
  end: string;
  title: string;
  speaker?: string;
  track?: string;
  location?: string;
  description?: string;
  kind: SessionKind;
}

export interface AgendaDay {
  date: string; // ISO-ish, e.g. "2026-06-11"
  label: string; // display
  sessions: AgendaSession[];
}

export const AGENDA_IS_PLACEHOLDER = false;

export const AGENDA: AgendaDay[] = [
  {
    date: "2026-06-11",
    label: "Thursday · 11 June 2026",
    sessions: [
      { id: "s1", start: "09:00", end: "10:00", title: "Doors open · Check-in", location: "Frankfurt · Agentic World", kind: "networking", description: "Coffee, pretzels & croissants · cloakroom · info point." },
      { id: "s2", start: "10:00", end: "11:30", title: "Opening speech by Vladi", speaker: "Vladi", location: "Stage Area", kind: "keynote", description: "The key message (90 min)." },
      { id: "s3", start: "11:30", end: "17:10", title: "Agentic World walkthrough", location: "Agentic World", kind: "demo", description: "Explore the agents reshaping procurement, all afternoon." },
      { id: "s4", start: "12:00", end: "", title: "Flying buffet (lunch)", location: "Agentic World", kind: "break", description: "From 12:00." },
      { id: "s5", start: "13:00", end: "17:10", title: "Workshops & 1-on-1s", track: "parallel", location: "Workshop Rooms", kind: "workshop", description: "5 × 2 workshop sessions (45 min each) in two rooms · 1-on-1s with the founders (C-level) & selected AEs." },
      { id: "s6", start: "17:15", end: "17:45", title: "Closing speech & Lio Awards", location: "Stage Area", kind: "keynote", description: "Including the Agent Award." },
      { id: "s7", start: "17:45", end: "20:00", title: "Flying buffet (dinner), drinks & DJ", location: "Agentic World", kind: "networking", description: "Food, drinks and networking." },
      { id: "s8", start: "20:00", end: "", title: "Bar & public viewing", location: "Stage Area", kind: "networking", description: "From 20:00." },
    ],
  },
];
