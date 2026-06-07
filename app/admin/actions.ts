"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminRequest } from "@/lib/admin";
import { db } from "@/lib/db";

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "contacted", "done"]),
});

/** Sales triage: mark a checkout request new -> contacted -> done. */
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
