"use client";

import { useState } from "react";
import { Plus, Check, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { catalog, CATEGORY_LABEL } from "@/lib/agents";
import { cn } from "@/lib/utils";

export function AddAgentsSheet({
  inSetup,
  onAdd,
  onRemove,
}: {
  inSetup: Set<string>;
  onAdd: (agentId: string) => void;
  onRemove: (agentId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const sections = catalog();
  const q = query.trim().toLowerCase();

  return (
    <Sheet>
      <SheetTrigger className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card/50 px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-card">
        <Plus className="h-4 w-4" />
        Add agents to your set-up
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="flex max-h-[85dvh] flex-col gap-0 rounded-t-xl p-0"
      >
        <SheetHeader className="border-b border-border px-5 pb-3 pt-4">
          <SheetTitle className="text-lg">Add agents</SheetTitle>
          <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-card px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 32 agents…"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </SheetHeader>

        <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-3">
          {sections.map(({ category, agents }) => {
            const matches = agents.filter(
              (a) =>
                !q ||
                a.name.toLowerCase().includes(q) ||
                a.tagline.toLowerCase().includes(q),
            );
            if (matches.length === 0) return null;
            return (
              <div key={category} data-agent={category} className="mb-4">
                <p className="label-uppercase px-2 py-1 text-muted-foreground">
                  {CATEGORY_LABEL[category]}
                </p>
                <div className="space-y-1">
                  {matches.map((a) => {
                    const added = inSetup.has(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => (added ? onRemove(a.id) : onAdd(a.id))}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
                          added
                            ? "border-agent/40 bg-agent/8"
                            : "border-border bg-card hover:bg-secondary/60",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                            added
                              ? "border-agent bg-agent text-agent-foreground"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-foreground">{a.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {a.tagline}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
