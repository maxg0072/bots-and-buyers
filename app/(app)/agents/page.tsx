import type { Metadata } from "next";
import { catalog, CATEGORY_LABEL, CATEGORY_DESC } from "@/lib/agents";
import { getCurrentParticipant } from "@/lib/auth";
import { db } from "@/lib/db";
import { AgentCard } from "@/components/agents/agent-card";
import { LioMark } from "@/components/lio-logo";

export const metadata: Metadata = { title: "Agent Booklet" };

export default async function AgentsPage() {
  const sections = catalog();

  // Map of agentId -> € backed, to badge cards already in the set-up.
  const participant = await getCurrentParticipant();
  const allocations = participant
    ? await db.allocation.findMany({
        where: { participantId: participant.id, amountEur: { gt: 0 } },
        select: { agentId: true, amountEur: true },
      })
    : [];
  const backed = new Map(allocations.map((a) => [a.agentId, a.amountEur]));

  return (
    <div className="space-y-9">
      <header className="lio-rise" data-agent="p2p">
        <p className="label-uppercase mb-3 flex items-center gap-2 text-muted-foreground">
          <LioMark className="h-3.5 w-3.5 text-agent" />
          Lio · Agentic World
        </p>
        <h1 className="text-4xl leading-[1.05] text-foreground">Pick your Agent</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          32 agents across six worlds - from request-to-pay to strategy. Open one
          to see the business case, a live ROI calculator and the proof.
        </p>
      </header>

      {sections.map(({ category, agents }, i) => (
        <section key={category} data-agent={category} className="lio-rise space-y-3">
          <div className="flex items-baseline gap-3 border-b border-border pb-2">
            <span className="display-num text-xl text-agent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="flex-1 text-lg leading-tight text-foreground">
              {CATEGORY_LABEL[category]}
            </h2>
          </div>
          <p className="text-xs leading-snug text-muted-foreground">
            {CATEGORY_DESC[category]}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {agents.map((a) => (
              <AgentCard key={a.id} agent={a} allocated={backed.get(a.id)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
