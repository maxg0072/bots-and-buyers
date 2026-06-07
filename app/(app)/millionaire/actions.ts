"use server";

import { z } from "zod";
import { getCurrentParticipant } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  score: z.number().int().min(0),
  levelReached: z.number().int().min(0).max(15),
  correctCount: z.number().int().min(0).max(15),
  totalAnswered: z.number().int().min(0).max(15),
  locale: z.enum(["de", "en"]),
});

export async function saveQuizResult(input: {
  score: number;
  levelReached: number;
  correctCount: number;
  totalAnswered: number;
  locale: "de" | "en";
}): Promise<{ ok: boolean }> {
  const p = await getCurrentParticipant();
  if (!p) return { ok: false };
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false };
  await db.quizResult.create({ data: { participantId: p.id, ...parsed.data } });
  return { ok: true };
}
