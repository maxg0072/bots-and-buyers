import Link from "next/link";
import type { Agent } from "@/lib/agents";
import { formatEur } from "@/lib/format";

export function AgentCard({
  agent,
  allocated,
}: {
  agent: Agent;
  /** € this participant has backed the agent with (shows a "backed" badge). */
  allocated?: number;
}) {
  return (
    <Link
      href={`/agents/${agent.id}`}
      data-agent={agent.category}
      className="lio-accent-rail shadow-lio group relative flex min-h-[6.5rem] flex-col gap-1.5 rounded-md border border-border bg-card p-4 pl-5 transition-transform hover:-translate-y-0.5"
    >
      <h3 className="text-[1.02rem] leading-tight text-foreground transition-colors group-hover:text-agent">
        {agent.name}
      </h3>
      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
        {agent.tagline}
      </p>
      {allocated ? (
        <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-agent/12 px-2 py-0.5 text-[0.65rem] font-medium text-agent">
          ★ {formatEur(allocated)} backed
        </span>
      ) : null}
    </Link>
  );
}
