"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z
    .string()
    .trim()
    .min(3, "Enter your email.")
    .max(200)
    .regex(EMAIL_RE, "Enter a valid email address."),
  company: z.string().trim().max(160).optional(),
  isExistingCustomer: z.boolean().optional(),
  marketingConsent: z.boolean().optional(),
});

export interface LoginState {
  fieldErrors?: Record<string, string>;
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: (formData.get("company") as string) || undefined,
    isExistingCustomer: formData.get("isExistingCustomer") === "on",
    marketingConsent: formData.get("marketingConsent") === "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const email = parsed.data.email.toLowerCase();
  const { name, company, isExistingCustomer, marketingConsent } = parsed.data;

  // Consent is required to enter (backstop for the required checkbox on the form).
  if (!marketingConsent) {
    return { error: "Please agree to be contacted so we can follow up after the event." };
  }

  let participantId: string;
  try {
    const participant = await db.participant.upsert({
      where: { email },
      update: {
        name,
        company: company || null,
        isExistingCustomer: !!isExistingCustomer,
        marketingConsent: !!marketingConsent,
      },
      create: {
        email,
        name,
        company: company || null,
        isExistingCustomer: !!isExistingCustomer,
        marketingConsent: !!marketingConsent,
      },
    });
    participantId = participant.id;
  } catch {
    return { error: "Something went wrong saving your details. Please try again." };
  }

  await createSession(participantId);
  // Drop any Router-Cache segments from a previously signed-in user so this
  // login always starts on its OWN data (fresh €1M), never the prior user's.
  revalidatePath("/", "layout");
  redirect("/");
}
