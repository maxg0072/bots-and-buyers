"use server";

import { z } from "zod";
import { getCurrentParticipant } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSetupSnapshot } from "@/lib/funnel";
import { getAgent } from "@/lib/agents";

const TYPES = ["demo", "offer", "analysis", "callback"] as const;

const schema = z.object({
  type: z.enum(TYPES),
  note: z.string().trim().max(1200).optional(),
  extraAgentId: z.string().max(80).optional(),
});

export interface CheckoutResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function createCheckoutRequest(input: {
  type: string;
  note?: string;
  extraAgentId?: string;
}): Promise<CheckoutResult> {
  const p = await getCurrentParticipant();
  if (!p) return { ok: false, error: "You're not signed in." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please pick what you'd like." };

  const snapshot = await getSetupSnapshot(p.id);
  const extraAgent =
    parsed.data.extraAgentId && getAgent(parsed.data.extraAgentId)
      ? { id: parsed.data.extraAgentId, name: getAgent(parsed.data.extraAgentId)!.name }
      : null;

  const payload = {
    snapshot,
    note: parsed.data.note ?? "",
    extraAgent,
    requestedAt: new Date().toISOString(),
    participant: { name: p.name, email: p.email, company: p.company, isExistingCustomer: p.isExistingCustomer },
  };

  try {
    const rec = await db.checkoutRequest.create({
      data: {
        participantId: p.id,
        type: parsed.data.type,
        note: parsed.data.note || null,
        payloadJson: JSON.stringify(payload),
      },
    });
    return { ok: true, id: rec.id };
  } catch {
    return { ok: false, error: "Something went wrong sending your request. Please try again." };
  }
}
