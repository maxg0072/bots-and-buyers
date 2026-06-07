import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAgent } from "@/lib/agents";
import { AgentDetail } from "@/components/agents/agent-detail";

type Params = { params: Promise<{ agentId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  return { title: agent?.name ?? "Agent" };
}

export default async function AgentPage({ params }: Params) {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  if (!agent) notFound();
  return <AgentDetail agent={agent} />;
}
