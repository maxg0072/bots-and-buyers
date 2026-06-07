import "server-only";
import { db } from "./db";
import { ONE_MILLION } from "./format";
import { roiContribution, hoursToFte } from "./calculators";
import { getAgent } from "./agents";

export interface BudgetState {
  total: number;
  allocated: number;
  balance: number;
}

/** A participant's €1M budget state (total, allocated across agents, remaining). */
export async function getBudgetState(participantId: string): Promise<BudgetState> {
  const agg = await db.allocation.aggregate({
    where: { participantId },
    _sum: { amountEur: true },
  });
  const allocated = agg._sum.amountEur ?? 0;
  return {
    total: ONE_MILLION,
    allocated,
    balance: Math.max(0, ONE_MILLION - allocated),
  };
}

export interface LeaderboardRow {
  agentId: string;
  total: number;
  backers: number;
}

/** Top agents across ALL participants, by total € backed. The room's vote. */
export async function getLeaderboard(limit = 10): Promise<LeaderboardRow[]> {
  const rows = await db.allocation.groupBy({
    by: ["agentId"],
    where: { amountEur: { gt: 0 } },
    _sum: { amountEur: true },
    _count: { _all: true },
    orderBy: { _sum: { amountEur: "desc" } },
    take: limit,
  });
  return rows.map((r) => ({
    agentId: r.agentId,
    total: r._sum.amountEur ?? 0,
    backers: r._count._all,
  }));
}

export interface SavedAllocation {
  agentId: string;
  amountEur: number;
  inputs: Record<string, number> | null;
}

/** A participant's current set-up (backed agents + their ROI inputs). */
export async function getSetup(participantId: string): Promise<SavedAllocation[]> {
  const rows = await db.allocation.findMany({
    where: { participantId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((r) => ({
    agentId: r.agentId,
    amountEur: r.amountEur,
    inputs: r.roiInputsJson ? safeParse(r.roiInputsJson) : null,
  }));
}

function safeParse(json: string): Record<string, number> | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export interface SnapshotItem {
  agentId: string;
  name: string;
  category: string;
  amountEur: number;
  hardEur: number;
  hoursPerYear: number;
}

export interface SetupSnapshot {
  items: SnapshotItem[];
  allocated: number;
  balance: number;
  hardEur: number;
  hoursPerYear: number;
  ftes: number;
}

/** A fully-computed snapshot of a participant's set-up + ROI (for checkout/admin). */
export async function getSetupSnapshot(participantId: string): Promise<SetupSnapshot> {
  const setup = await getSetup(participantId);
  const items: SnapshotItem[] = setup
    .filter((s) => s.amountEur > 0)
    .map((s) => {
      const c = roiContribution(s.agentId, s.inputs ?? undefined);
      const agent = getAgent(s.agentId);
      return {
        agentId: s.agentId,
        name: agent?.name ?? s.agentId,
        category: agent?.category ?? "others",
        amountEur: s.amountEur,
        hardEur: c.hardEur,
        hoursPerYear: c.hoursPerYear,
      };
    })
    .sort((a, b) => b.amountEur - a.amountEur);

  const allocated = items.reduce((a, i) => a + i.amountEur, 0);
  const hardEur = items.reduce((a, i) => a + i.hardEur, 0);
  const hoursPerYear = items.reduce((a, i) => a + i.hoursPerYear, 0);
  return {
    items,
    allocated,
    balance: Math.max(0, ONE_MILLION - allocated),
    hardEur,
    hoursPerYear,
    ftes: hoursToFte(hoursPerYear),
  };
}
