"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { formatEur } from "@/lib/format";
import { fetchQuizLeaderboard } from "@/app/(app)/millionaire/actions";
import type { QuizLeaderRow } from "@/lib/quiz";
import { cn } from "@/lib/utils";

/**
 * Live global quiz ranking. Seeds from a server-rendered `initial` list, then
 * re-polls every `pollMs` so everyone's board stays in sync as people play.
 */
export function QuizLeaderboard({
  initial,
  meId,
  title = "Leaderboard",
  pollMs = 7000,
}: {
  initial: QuizLeaderRow[];
  meId?: string;
  title?: string;
  pollMs?: number;
}) {
  const [rows, setRows] = useState<QuizLeaderRow[]>(initial);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const next = await fetchQuizLeaderboard();
        if (alive && Array.isArray(next)) setRows(next);
      } catch {
        /* keep last good board on a transient failure */
      }
    };
    void tick(); // refresh immediately on mount (e.g. right after a game ends)
    const id = setInterval(tick, pollMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [pollMs]);

  return (
    <section className="w-full text-left" data-agent="p2s">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base text-foreground">
          <Trophy className="h-4 w-4 text-agent" /> {title}
        </h2>
        <span className="flex items-center gap-1.5 text-[0.62rem] font-medium tracking-wide text-agent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-agent" /> Live
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-card/40 px-5 py-6 text-center text-sm text-muted-foreground">
          No scores yet - be the first on the board.
        </p>
      ) : (
        <ol className="space-y-2">
          {rows.map((r, i) => {
            const isMe = !!meId && r.participantId === meId;
            return (
              <li
                key={r.participantId}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
                  isMe ? "border-agent bg-agent/8" : "border-border bg-card",
                )}
              >
                <span className="display-num w-6 shrink-0 text-sm tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {r.name}
                  {isMe && <span className="ml-1.5 text-[0.62rem] font-medium text-agent">You</span>}
                </span>
                <span className="shrink-0 text-[0.65rem] tabular-nums text-muted-foreground">
                  {r.bestCorrect}/15
                </span>
                <span className="display-num shrink-0 text-sm tabular-nums text-agent">
                  {formatEur(r.score)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
