"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { submitEngagement } from "@/app/(app)/connect/actions";

/** Inline request form for the FDE + Agentic Assessment offers (saves to the DB). */
export function EngagementForm({
  type,
  accent,
  placeholder,
  cta = "Send request",
}: {
  type: "fde" | "assessment";
  accent: string;
  placeholder: string;
  cta?: string;
}) {
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit() {
    if (status === "sending" || status === "done") return;
    setStatus("sending");
    const r = await submitEngagement({ type, details: details.trim() || undefined });
    setStatus(r.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <div
        data-agent={accent}
        className="mt-4 flex items-center gap-3 rounded-md border border-agent/30 bg-agent/8 px-4 py-3"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-agent/15 text-agent">
          <Check className="h-4 w-4" />
        </span>
        <p className="text-sm text-foreground">
          Got it - we&apos;ll reach out after the event. Thanks!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4" data-agent={accent}>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full resize-none rounded-md border border-border bg-card px-3 py-2.5 text-sm leading-snug outline-none transition-colors placeholder:text-muted-foreground focus:border-agent"
      />
      {status === "error" && (
        <p className="mt-1 text-xs text-destructive" role="alert">
          Something went wrong - please try again.
        </p>
      )}
      <button
        onClick={submit}
        disabled={status === "sending"}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.99] disabled:opacity-60"
      >
        {status === "sending" ? (
          "Sending…"
        ) : (
          <>
            <Send className="h-4 w-4" /> {cta}
          </>
        )}
      </button>
      <p className="mt-2 text-xs text-muted-foreground">
        We already have your name and email - we&apos;ll follow up there.
      </p>
    </div>
  );
}
