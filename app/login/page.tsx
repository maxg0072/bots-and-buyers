import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { LioLogo } from "@/components/lio-logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getCurrentParticipant()) redirect("/");

  return (
    <div
      className="lio-stage relative flex min-h-dvh flex-col items-center justify-center px-6 py-12"
      data-agent="s2c"
    >
      <div className="w-full max-w-sm">
        <div className="lio-rise mb-8 text-center">
          <LioLogo className="mx-auto h-8 text-foreground" />
          <p className="label-uppercase mt-7 text-muted-foreground">Bots &amp; Buyers</p>
          <h1 className="mt-2 text-3xl leading-tight text-foreground">
            Welcome to the
            <br />
            <span className="lio-mega">Agentic World</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Sign in to build your agent set-up, vote, and play. Everything saves
            automatically to your email.
          </p>
        </div>

        <div className="lio-rise lio-rise-1">
          <LoginForm />
        </div>

        <p className="lio-rise lio-rise-2 mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          No password needed. We only use your email to save your set-up and
          follow up after the event.
        </p>
      </div>
    </div>
  );
}
