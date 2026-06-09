import type { Metadata } from "next";
import { getCurrentParticipant } from "@/lib/auth";
import { getQuizLeaderboard } from "@/lib/quiz";
import { Millionaire } from "@/components/quiz/millionaire";

export const metadata: Metadata = { title: "Who Wants to Be a Millionaire?" };

export default async function MillionairePage() {
  const [participant, leaderboard] = await Promise.all([
    getCurrentParticipant(),
    getQuizLeaderboard(10),
  ]);
  return <Millionaire initialLeaderboard={leaderboard} meId={participant?.id} />;
}
