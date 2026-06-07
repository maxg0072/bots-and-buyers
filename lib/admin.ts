import "server-only";
import { db } from "./db";
import { getCurrentParticipant, participantIsAdmin } from "./auth";
import { roiContribution, hoursToFte } from "./calculators";
import { getAgent } from "./agents";
import { ONE_MILLION } from "./format";

/** Admin access is the email gate only: signed in as the admin account. */
export async function isAdminRequest(): Promise<boolean> {
  return participantIsAdmin(await getCurrentParticipant());
}

/* ----------------------------- dashboard data ---------------------------- */

function parseInputs(json: string | null): Record<string, number> | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
}

export interface AdminParticipant {
  id: string;
  email: string;
  name: string;
  company: string | null;
  isExistingCustomer: boolean;
  marketingConsent: boolean;
  createdAt: string;
  agentsBacked: number;
  allocated: number;
  hardEur: number;
  ftes: number;
  topAgents: { name: string; amountEur: number }[];
  requestTypes: string[];
  bestQuiz: number | null;
}

export interface AdminLeaderRow {
  agentId: string;
  name: string;
  category: string;
  total: number;
  backers: number;
}

export interface AdminRequest {
  id: string;
  type: string;
  status: string;
  note: string | null;
  createdAt: string;
  participant: { name: string; email: string; company: string | null; isExistingCustomer: boolean; marketingConsent: boolean };
  agents: { name: string; amountEur: number }[];
  hardEur: number;
  ftes: number;
}

export interface AdminData {
  totals: {
    participants: number;
    withSetup: number;
    allocated: number;
    requests: number;
    requestsByType: Record<string, number>;
    quizPlays: number;
  };
  leaderboard: AdminLeaderRow[];
  requests: AdminRequest[];
  participants: AdminParticipant[];
}

export async function getAdminData(): Promise<AdminData> {
  const participants = await db.participant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      allocations: true,
      checkoutRequests: { orderBy: { createdAt: "desc" } },
      quizResults: true,
    },
  });

  const leaderMap = new Map<string, { total: number; backers: number }>();
  const requestsByType: Record<string, number> = {};
  let totalAllocated = 0;
  let withSetup = 0;
  let requestCount = 0;
  let quizPlays = 0;

  const adminParticipants: AdminParticipant[] = [];
  const adminRequests: AdminRequest[] = [];

  for (const p of participants) {
    const backed = p.allocations.filter((a) => a.amountEur > 0);
    let hardEur = 0;
    let hours = 0;
    const named = backed.map((a) => {
      const c = roiContribution(a.agentId, parseInputs(a.roiInputsJson));
      hardEur += c.hardEur;
      hours += c.hoursPerYear;
      // leaderboard
      const cur = leaderMap.get(a.agentId) ?? { total: 0, backers: 0 };
      cur.total += a.amountEur;
      cur.backers += 1;
      leaderMap.set(a.agentId, cur);
      return { name: getAgent(a.agentId)?.name ?? a.agentId, amountEur: a.amountEur };
    });
    named.sort((x, y) => y.amountEur - x.amountEur);

    const allocated = backed.reduce((s, a) => s + a.amountEur, 0);
    totalAllocated += allocated;
    if (backed.length > 0) withSetup += 1;
    quizPlays += p.quizResults.length;
    const bestQuiz = p.quizResults.length
      ? Math.max(...p.quizResults.map((q) => q.score))
      : null;

    adminParticipants.push({
      id: p.id,
      email: p.email,
      name: p.name,
      company: p.company,
      isExistingCustomer: p.isExistingCustomer,
      marketingConsent: p.marketingConsent,
      createdAt: p.createdAt.toISOString(),
      agentsBacked: backed.length,
      allocated,
      hardEur,
      ftes: hoursToFte(hours),
      topAgents: named.slice(0, 3),
      requestTypes: [...new Set(p.checkoutRequests.map((r) => r.type))],
      bestQuiz,
    });

    for (const r of p.checkoutRequests) {
      requestCount += 1;
      requestsByType[r.type] = (requestsByType[r.type] ?? 0) + 1;
      adminRequests.push({
        id: r.id,
        type: r.type,
        status: r.status,
        note: r.note,
        createdAt: r.createdAt.toISOString(),
        participant: {
          name: p.name,
          email: p.email,
          company: p.company,
          isExistingCustomer: p.isExistingCustomer,
          marketingConsent: p.marketingConsent,
        },
        agents: named.slice(0, 6),
        hardEur,
        ftes: hoursToFte(hours),
      });
    }
  }

  adminRequests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const leaderboard: AdminLeaderRow[] = [...leaderMap.entries()]
    .map(([agentId, v]) => ({
      agentId,
      name: getAgent(agentId)?.name ?? agentId,
      category: getAgent(agentId)?.category ?? "others",
      total: v.total,
      backers: v.backers,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    totals: {
      participants: participants.length,
      withSetup,
      allocated: totalAllocated,
      requests: requestCount,
      requestsByType,
      quizPlays,
    },
    leaderboard,
    requests: adminRequests,
    participants: adminParticipants,
  };
}

export { ONE_MILLION };
