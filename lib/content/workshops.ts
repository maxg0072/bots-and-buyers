/* =============================================================================
   WORKSHOP SCHEDULE - Bots & Buyers, 11 June 2026.
   Two parallel rooms, five 45-min sessions. Titles + room only (no presenters).
   ============================================================================= */

export interface WorkshopSlot {
  time: string;
  room1: string;
  room2: string;
}

export const WORKSHOPS_IS_PLACEHOLDER = false;

export const WORKSHOP_SLOTS: WorkshopSlot[] = [
  {
    time: "13:00-13:45",
    room1: "Roast My Procurement",
    room2: "FDE On-Site Workshop",
  },
  {
    time: "13:50-14:35",
    room1: "Agentic Opportunity Assessment",
    room2: "Build Your Own Agentic Workforce",
  },
  {
    time: "14:40-15:25",
    room1: "Build Your Own Agentic Workforce",
    room2: "FDE On-Site Workshop",
  },
  {
    time: "15:30-16:15",
    room1: "Roast My Procurement",
    room2: "Agentic Procurement Transformation",
  },
  {
    time: "16:20-17:05",
    room1: "SAP SRM Replacement",
    room2: "Agentic Opportunity Assessment",
  },
];
