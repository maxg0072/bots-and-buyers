"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { loginAction, type LoginState } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initial: LoginState = {};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-destructive">{msg}</p>;
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name" className="label-uppercase mb-1.5 block text-muted-foreground">
          Your name
        </Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Alex Müller"
          aria-invalid={!!fe.name}
          className="h-11"
          required
        />
        <FieldError msg={fe.name} />
      </div>

      <div>
        <Label htmlFor="email" className="label-uppercase mb-1.5 block text-muted-foreground">
          Work email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="alex@company.com"
          aria-invalid={!!fe.email}
          className="h-11"
          required
        />
        <FieldError msg={fe.email} />
      </div>

      <div>
        <Label htmlFor="company" className="label-uppercase mb-1.5 block text-muted-foreground">
          Company <span className="normal-case tracking-normal opacity-60">· optional</span>
        </Label>
        <Input
          id="company"
          name="company"
          autoComplete="organization"
          placeholder="ACME GmbH"
          className="h-11"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-card px-4 py-3">
        <input
          type="checkbox"
          name="isExistingCustomer"
          className="h-4 w-4 accent-accent"
        />
        <span className="text-sm text-foreground">I&apos;m already a Lio customer</span>
      </label>

      <label className="flex cursor-pointer items-start gap-3 px-1">
        <input
          type="checkbox"
          name="marketingConsent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
        />
        <span className="text-xs leading-snug text-muted-foreground">
          Lio may contact me about my set-up and follow up after the event. See the{" "}
          <a
            href="https://lio.ai/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-2"
          >
            privacy notice
          </a>
          .
        </span>
      </label>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="mt-1 h-12 w-full gap-2 text-base"
      >
        {pending ? "Entering…" : "Enter the Agentic World"}
        {!pending && <ArrowRight className="h-4 w-4" />}
      </Button>
    </form>
  );
}
