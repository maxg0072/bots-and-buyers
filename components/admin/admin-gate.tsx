"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ShieldCheck, KeyRound } from "lucide-react";
import { enterAdmin, type AdminGateState } from "@/app/admin/actions";
import { LioLogo } from "@/components/lio-logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initial: AdminGateState = {};

export function AdminGate({ stage }: { stage: "login" | "code" }) {
  const [state, action, pending] = useActionState(enterAdmin, initial);

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 py-12"
      data-agent="services"
    >
      <div className="w-full max-w-xs">
        <div className="mb-8 text-center">
          <LioLogo className="mx-auto h-7 text-foreground" />
          <p className="label-uppercase mt-6 flex items-center justify-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Sales dashboard
          </p>
          <h1 className="mt-2 text-2xl text-foreground">Admin access</h1>
        </div>

        {stage === "login" ? (
          <div className="space-y-4 text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              The dashboard is restricted to the Lio admin account. Sign in with
              the admin email first, then enter your verification code.
            </p>
            <Button render={<Link href="/login" />} className="h-11 w-full">
              Go to sign in
            </Button>
          </div>
        ) : (
          <form action={action} className="flex flex-col gap-3">
            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              Enter the 6-digit code from your authenticator app.
            </p>
            <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              <input
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={6}
                autoFocus
                placeholder="000000"
                aria-invalid={!!state.error}
                className="h-11 w-full bg-transparent text-center text-lg tracking-[0.4em] outline-none placeholder:text-muted-foreground/50"
              />
            </div>
            {state.error && (
              <p className="text-center text-xs text-destructive" role="alert">
                {state.error}
              </p>
            )}
            <Button type="submit" disabled={pending} className="h-11 w-full">
              {pending ? "Checking…" : "Unlock dashboard"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
