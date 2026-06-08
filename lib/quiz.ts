import "server-only";
import { db } from "./db";

export interface QuizLeaderRow {
  participantId: string;
  name: string;
  score: number; // best prize banked (EUR)
  bestCorrect: number; // best number of correct answers (0-15)
  plays: number;
}

/**
 * Global "Wer wird Millionär" ranking - each player's BEST run, top N, across
 * all attendees. Ordered by prize, then by correct answers. Polled live by the
 * quiz screen so everyone sees the board update as people play.
 */
export async function getQuizLeaderboard(limit = 10): Promise<QuizLeaderRow[]> {
  const grouped = await db.quizResult.groupBy({
    by: ["participantId"],
    _max: { score: true, correctCount: true },
    _count: { _all: true },
  });
  if (grouped.length === 0) return [];

  const people = await db.participant.findMany({
    where: { id: { in: grouped.map((g) => g.participantId) } },
    select: { id: true, name: true },
  });
  const nameById = new Map(people.map((p) => [p.id, p.name]));

  return grouped
    .map((g) => ({
      participantId: g.participantId,
      name: nameById.get(g.participantId) ?? "Guest",
      score: g._max.score ?? 0,
      bestCorrect: g._max.correctCount ?? 0,
      plays: g._count._all,
    }))
    .sort((a, b) => b.score - a.score || b.bestCorrect - a.bestCorrect)
    .slice(0, limit);
}
