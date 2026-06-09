/* =============================================================================
   LAGEPLAN / VENUE  ✏️  PLACEHOLDER.
   Drop the real floor-plan image at /public/lageplan.png (or .svg) and set
   `mapImage` to its path. Edit `POIS` with the real points of interest.
   ============================================================================= */

export interface Poi {
  id: string;
  label: string;
  note?: string;
  /** Optional % coordinates for pin overlay on the map image (0-100). */
  x?: number;
  y?: number;
}

/** Set to "/lageplan.png" once the image is added to /public. */
export const MAP_IMAGE: string | null = null;

export const VENUE_IS_PLACEHOLDER = true;

export const POIS: Poi[] = [
  { id: "stage", label: "Main Stage", note: "Keynotes, demos & the Millionaire quiz finale" },
  { id: "workshops", label: "Workshop Rooms A-C", note: "Hands-on sessions" },
  { id: "demos", label: "Demo Booths", note: "See the agents up close" },
  { id: "lounge", label: "Networking Lounge", note: "Coffee, drinks & conversations" },
  { id: "registration", label: "Registration & Foyer", note: "Check-in and info desk" },
];
