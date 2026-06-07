import "server-only";
import { cache } from "react";
import type { Participant } from "@prisma/client";
import { db } from "./db";
import { getSessionPid } from "./session";

/** The single email allowed admin access (override via ADMIN_EMAILS, first entry).
 *  NOTE: this only decides who *may* attempt admin - access also requires a valid
 *  TOTP code (see lib/admin.ts), because email login itself is unverified. */
export const ADMIN_EMAIL = (process.env.ADMIN_EMAILS || "max.grau@lio.ai")
  .split(",")[0]
  .trim()
  .toLowerCase();

export function emailIsAdmin(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

export function participantIsAdmin(p: Participant | null | undefined): boolean {
  return !!p && emailIsAdmin(p.email);
}

/** The signed-in participant for this request, or null. Memoized per request. */
export const getCurrentParticipant = cache(
  async (): Promise<Participant | null> => {
    const pid = await getSessionPid();
    if (!pid) return null;
    return db.participant.findUnique({ where: { id: pid } });
  },
);
