"use server";

import { getCurrentParticipant } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAgent } from "@/lib/agents";
import { ONE_MILLION } from "@/lib/format";

export interface SaveResult {
  ok: boolean;
  amountEur?: number;
  balance?: number;
  error?: string;
}

/** Upsert how much of the €1M a participant backs an agent with (server-clamped). */
export async function saveAllocation(
  agentId: string,
  amountEur: number,
  roiInputsJson?: string | null,
): Promise<SaveResult> {
  const p = await getCurrentParticipant();
  if (!p) return { ok: false, error: "Not signed in." };
  if (!getAgent(agentId)) return { ok: false, error: "Unknown agent." };

  const requested = Math.max(0, Math.min(ONE_MILLION, Math.round(amountEur || 0)));

  const others = await db.allocation.aggregate({
    where: { participantId: p.id, NOT: { agentId } },
    _sum: { amountEur: true },
  });
  const othersSum = others._sum.amountEur ?? 0;
  const clamped = Math.max(0, Math.min(requested, ONE_MILLION - othersSum));

  await db.allocation.upsert({
    where: { participantId_agentId: { participantId: p.id, agentId } },
    update: {
      amountEur: clamped,
      ...(roiInputsJson !== undefined ? { roiInputsJson } : {}),
    },
    create: {
      participantId: p.id,
      agentId,
      amountEur: clamped,
      roiInputsJson: roiInputsJson ?? null,
    },
  });

  return { ok: true, amountEur: clamped, balance: ONE_MILLION - othersSum - clamped };
}

/** Remove an agent from the set-up. */
export async function removeAllocation(agentId: string): Promise<SaveResult> {
  const p = await getCurrentParticipant();
  if (!p) return { ok: false, error: "Not signed in." };
  await db.allocation.deleteMany({ where: { participantId: p.id, agentId } });
  return { ok: true };
}
