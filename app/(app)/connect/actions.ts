"use server";

import { z } from "zod";
import { getCurrentParticipant } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSetupSnapshot } from "@/lib/funnel";

const TYPES = ["demo", "fde", "assessment"] as const;

const schema = z.object({
  type: z.enum(TYPES),
  details: z.string().trim().max(1500).optional(),
});

export interface EngagementResult {
  ok: boolean;
  error?: string;
}

/**
 * Save an engagement request - a demo-booking intent, a Forward Deployed
 * Engineering enquiry, or an Agentic Assessment enquiry - for sales follow-up.
 * Reuses the CheckoutRequest table (type = demo | fde | assessment), so these
 * land in the same admin dashboard + CSV export.
 */
export async function submitEngagement(input: {
  type: string;
  details?: string;
}): Promise<EngagementResult> {
  const p = await getCurrentParticipant();
  if (!p) return { ok: false, error: "You're not signed in." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please add a few details." };

  let snapshot = null;
  try {
    snapshot = await getSetupSnapshot(p.id);
  } catch {
    /* a built set-up is optional for an engagement request */
  }

  const payload = {
    kind: parsed.data.type,
    details: parsed.data.details ?? "",
    snapshot,
    requestedAt: new Date().toISOString(),
    participant: {
      name: p.name,
      email: p.email,
      company: p.company,
      isExistingCustomer: p.isExistingCustomer,
    },
  };

  try {
    await db.checkoutRequest.create({
      data: {
        participantId: p.id,
        type: parsed.data.type,
        note: parsed.data.details || null,
        payloadJson: JSON.stringify(payload),
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong sending your request. Please try again." };
  }
}
