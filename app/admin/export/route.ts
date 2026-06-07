import { isAdminRequest, getAdminData } from "@/lib/admin";

export const dynamic = "force-dynamic";

function cell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  if (!(await isAdminRequest())) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await getAdminData();
  const header = [
    "Name",
    "Email",
    "Company",
    "Marketing consent",
    "Type",
    "Agents backed",
    "EUR backed",
    "Hard savings/yr (EUR)",
    "FTEs freed",
    "Top agents",
    "Requests",
    "Best quiz (EUR)",
    "Joined",
  ];
  const rows = data.participants.map((p) => [
    p.name,
    p.email,
    p.company ?? "",
    p.marketingConsent ? "Yes" : "No",
    p.isExistingCustomer ? "Customer" : "Prospect",
    p.agentsBacked,
    p.allocated,
    Math.round(p.hardEur),
    p.ftes.toFixed(1),
    p.topAgents.map((a) => `${a.name} (${a.amountEur})`).join(" | "),
    p.requestTypes.join(" | "),
    p.bestQuiz ?? "",
    new Date(p.createdAt).toISOString(),
  ]);

  const csv = [header, ...rows].map((r) => r.map(cell).join(",")).join("\n");

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bots-and-buyers-attendees.csv"',
    },
  });
}
