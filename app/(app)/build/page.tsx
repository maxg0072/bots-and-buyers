import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { getSetup, getLeaderboard } from "@/lib/funnel";
import { Funnel } from "@/components/funnel/funnel";

export const metadata: Metadata = { title: "Build your set-up" };

export default async function BuildPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/login");

  const { agent } = await searchParams;
  const [setup, leaderboard] = await Promise.all([
    getSetup(participant.id),
    getLeaderboard(10),
  ]);

  return <Funnel initial={setup} leaderboard={leaderboard} autoAddAgentId={agent} />;
}
