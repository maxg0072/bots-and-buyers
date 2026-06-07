"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import {
  grantAdmin,
  revokeAdmin,
  verifyAdminCode,
  isAdminRequest,
  adminRateLimited,
  recordAdminAttempt,
  clearAdminAttempts,
} from "@/lib/admin";
import { getCurrentParticipant, participantIsAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export interface AdminGateState {
  error?: string;
}

export async function enterAdmin(
  _prev: AdminGateState,
  formData: FormData,
): Promise<AdminGateState> {
  // Must be signed in as the admin email (defense in depth) ...
  const p = await getCurrentParticipant();
  if (!participantIsAdmin(p)) {
    return { error: "Admin access is restricted to the Lio admin account." };
  }
  // Rate-limit brute force by client IP (the TOTP code is only 6 digits).
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0]?.trim() || "unknown";
  if (await adminRateLimited(ip)) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }
  // ... and present a valid authenticator code.
  const code = String(formData.get("code") || "");
  if (!verifyAdminCode(code)) {
    await recordAdminAttempt(ip);
    return { error: "Invalid or expired code." };
  }
  await clearAdminAttempts(ip);
  await grantAdmin();
  redirect("/admin");
}

export async function exitAdmin(): Promise<void> {
  await revokeAdmin();
  redirect("/admin");
}

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "contacted", "done"]),
});

/** Sales triage: mark a checkout request new → contacted → done. */
export async function updateRequestStatus(
  id: string,
  status: string,
): Promise<{ ok: boolean }> {
  if (!(await isAdminRequest())) return { ok: false };
  const parsed = statusSchema.safeParse({ id, status });
  if (!parsed.success) return { ok: false };
  await db.checkoutRequest.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });
  revalidatePath("/admin");
  return { ok: true };
}
