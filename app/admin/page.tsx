import type { Metadata } from "next";
import { isAdminRequest, getAdminData } from "@/lib/admin";
import { getCurrentParticipant, participantIsAdmin } from "@/lib/auth";
import { AdminGate } from "@/components/admin/admin-gate";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = { title: "Sales dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (await isAdminRequest()) {
    const data = await getAdminData();
    return <AdminDashboard data={data} />;
  }
  const p = await getCurrentParticipant();
  return <AdminGate stage={participantIsAdmin(p) ? "code" : "login"} />;
}
