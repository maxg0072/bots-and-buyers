/**
 * Demo data for local dev + dashboard testing.
 *   DATABASE_URL="file:./prisma/dev.db" npx tsx prisma/seed.ts
 * (DB is gitignored, so this never ships to production.)
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type Demo = {
  email: string;
  name: string;
  company: string;
  customer: boolean;
  allocs: [string, number][];
  requests: [string, string][];
  quiz?: number;
};

const PEOPLE: Demo[] = [
  {
    email: "anna.berger@dpd.com",
    name: "Anna Berger",
    company: "DPD",
    customer: false,
    allocs: [["guided-buying", 300000], ["pr-review", 200000], ["sourcing-agent", 150000]],
    requests: [["demo", "Keen to see Guided Buying running on SAP."]],
    quiz: 64000,
  },
  {
    email: "tom.fischer@siemens.com",
    name: "Tom Fischer",
    company: "Siemens",
    customer: true,
    allocs: [["strategic-sourcing-hub", 400000], ["tail-spend-negotiation", 250000]],
    requests: [["offer", ""]],
    quiz: 8000,
  },
  {
    email: "lena.wolf@dm.de",
    name: "Lena Wolf",
    company: "dm-drogerie markt",
    customer: false,
    allocs: [["invoice-agent", 250000], ["goods-receipt", 150000], ["guided-buying", 200000]],
    requests: [["analysis", "Would love a spend analysis for indirect categories."], ["callback", ""]],
    quiz: 125000,
  },
  {
    email: "marco.rossi@enel.com",
    name: "Marco Rossi",
    company: "Enel",
    customer: false,
    allocs: [["agentic-srm", 200000], ["supplier-onboarding", 150000]],
    requests: [],
    quiz: 2000,
  },
];

async function main() {
  for (const p of PEOPLE) {
    const participant = await db.participant.upsert({
      where: { email: p.email },
      update: { name: p.name, company: p.company, isExistingCustomer: p.customer },
      create: { email: p.email, name: p.name, company: p.company, isExistingCustomer: p.customer },
    });
    for (const [agentId, amountEur] of p.allocs) {
      await db.allocation.upsert({
        where: { participantId_agentId: { participantId: participant.id, agentId } },
        update: { amountEur },
        create: { participantId: participant.id, agentId, amountEur },
      });
    }
    for (const [type, note] of p.requests) {
      await db.checkoutRequest.create({
        data: {
          participantId: participant.id,
          type,
          note: note || null,
          payloadJson: JSON.stringify({ seeded: true }),
        },
      });
    }
    if (p.quiz != null) {
      await db.quizResult.create({
        data: {
          participantId: participant.id,
          score: p.quiz,
          levelReached: 10,
          correctCount: 10,
          totalAnswered: 11,
          locale: "de",
        },
      });
    }
  }
  const n = await db.participant.count();
  console.log(`Seeded. Participants in DB: ${n}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
