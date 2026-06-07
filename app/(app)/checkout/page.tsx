import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { getSetupSnapshot } from "@/lib/funnel";
import { getAgent } from "@/lib/agents";
import { Checkout } from "@/components/checkout/checkout";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; agent?: string }>;
}) {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/login");

  const { intent, agent } = await searchParams;
  const snapshot = await getSetupSnapshot(participant.id);
  const extraAgent = agent ? getAgent(agent) : undefined;

  return (
    <Checkout
      snapshot={snapshot}
      email={participant.email}
      initialIntent={intent}
      extraAgentId={extraAgent?.id}
      extraAgentName={extraAgent?.name}
    />
  );
}
