"use client";

import { useState, useTransition } from "react";
import { updateRequestStatus } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const STEPS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "done", label: "Done" },
] as const;

export function RequestStatus({ id, status }: { id: string; status: string }) {
  const [current, setCurrent] = useState(status);
  const [pending, start] = useTransition();

  function set(s: string) {
    if (s === current) return;
    setCurrent(s); // optimistic
    start(async () => {
      const res = await updateRequestStatus(id, s);
      if (!res.ok) setCurrent(status); // revert on failure
    });
  }

  return (
    <div
      className={cn(
        "inline-flex rounded-md border border-border bg-secondary/40 p-0.5 text-[0.62rem] font-medium",
        pending && "opacity-60",
      )}
      role="group"
      aria-label="Request status"
    >
      {STEPS.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => set(s.value)}
          aria-pressed={current === s.value}
          className={cn(
            "rounded px-2 py-1 transition-colors",
            current === s.value
              ? s.value === "done"
                ? "bg-accent text-accent-foreground"
                : "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
