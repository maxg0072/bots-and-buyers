"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import type { CalculatorInput } from "@/lib/agents";
import { runCalculator } from "@/lib/calculators";
import { formatEur } from "@/lib/format";

function formatInputValue(input: CalculatorInput, v: number): string {
  if (input.unit === "€") return formatEur(v);
  if (input.unit === "%") return `${v}%`;
  if (input.unit) return `${v.toLocaleString("en-US")} ${input.unit}`;
  return v.toLocaleString("en-US");
}

export function RoiCalculator({
  agentId,
  inputs,
  values: controlled,
  onChange,
  compact = false,
}: {
  agentId: string;
  inputs: CalculatorInput[];
  values?: Record<string, number>;
  onChange?: (v: Record<string, number>) => void;
  compact?: boolean;
}) {
  const [internal, setInternal] = useState<Record<string, number>>(() =>
    Object.fromEntries(inputs.map((i) => [i.id, i.default])),
  );
  const values = controlled ?? internal;

  function update(id: string, v: number) {
    const next = { ...values, [id]: v };
    if (onChange) onChange(next);
    else setInternal(next);
  }

  const outputs = useMemo(() => runCalculator(agentId, values) ?? [], [agentId, values]);

  return (
    <div className={compact ? "space-y-5" : "grid gap-5 sm:grid-cols-2"}>
      {/* Sliders */}
      <div className="space-y-5">
        <p className="label-uppercase text-muted-foreground">Calculate your impact</p>
        {inputs.map((input) => (
          <div key={input.id}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <label className="text-sm leading-snug text-foreground">{input.label}</label>
              <span className="display-num shrink-0 text-sm tabular-nums text-agent">
                {formatInputValue(input, values[input.id])}
              </span>
            </div>
            <Slider
              min={input.min}
              max={input.max}
              step={input.step}
              value={[values[input.id]]}
              onValueChange={(v) => update(input.id, (v as number[])[0])}
              aria-label={input.label}
            />
          </div>
        ))}
      </div>

      {/* Live outputs */}
      <div className="lio-surface-light rounded-md p-5">
        <div className="flex items-center justify-between">
          <p className="label-uppercase text-muted-foreground">Your impact</p>
          <span className="flex items-center gap-1.5 text-[0.62rem] font-medium tracking-wide text-agent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-agent" />
            LIVE
          </span>
        </div>
        <div className="mt-4 space-y-3" aria-live="polite" aria-atomic="true">
          {outputs.map((o, idx) =>
            o.highlight ? (
              <div key={idx} className="border-t border-border/60 pt-3 first:border-0 first:pt-0">
                <p className="text-xs leading-snug text-muted-foreground">{o.label}</p>
                <p className="display-num mt-0.5 text-3xl leading-tight text-agent">{o.display}</p>
              </div>
            ) : (
              <div key={idx} className="flex items-baseline justify-between gap-3">
                <span className="text-xs leading-snug text-muted-foreground">{o.label}</span>
                <span className="display-num shrink-0 text-sm tabular-nums text-foreground">{o.display}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
