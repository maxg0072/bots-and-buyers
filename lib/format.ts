/**
 * Currency / number formatters - faithful to the original "U()" used across the
 * Lio agent calculators (e.g. 50_000_000 → "€50.0M", 3_750_000 → "€3.75M").
 */

/** Compact euro: €1.2M, €450K, €1.0B. Mirrors the original calculator formatter. */
export function formatEur(n: number): string {
  if (!Number.isFinite(n)) return "€0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}€${trim(abs / 1_000_000_000)}B`;
  if (abs >= 1_000_000) return `${sign}€${trim(abs / 1_000_000)}M`;
  if (abs >= 1_000) return `${sign}€${Math.round(abs / 1_000)}K`;
  return `${sign}€${Math.round(abs)}`;
}

/** Significant-ish decimals: 100+ → 0dp, 10-99 → 1dp, <10 → up to 2dp, always ≥1 decimal. */
function trim(v: number): string {
  let s: string;
  if (v >= 100) s = v.toFixed(0);
  else if (v >= 10) s = v.toFixed(1);
  else s = v.toFixed(2);
  if (s.includes(".")) {
    s = s.replace(/0+$/, "");
    if (s.endsWith(".")) s += "0";
  }
  return s;
}

/** Full euro with grouping: €1,000,000. */
export function formatEurFull(n: number): string {
  if (!Number.isFinite(n)) return "€0";
  return `€${Math.round(n).toLocaleString("en-US")}`;
}

/** Plain grouped integer: 1,234. */
export function formatInt(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toLocaleString("en-US");
}

/** Hours display, e.g. "~1,234 h/yr". */
export function formatHours(n: number, suffix = "h"): string {
  if (!Number.isFinite(n)) return `~0 ${suffix}`;
  return `~${Math.round(n).toLocaleString("en-US")} ${suffix}`;
}

/**
 * Read a Base UI slider callback value. Base UI passes a plain `number` for a
 * single-thumb slider (an array only for range sliders), so we normalize both
 * shapes and guard against NaN/undefined - this is what keeps a stray slider
 * value from turning the funnel/ROI totals into NaN and crashing the page.
 */
export function sliderValue(v: unknown): number {
  const n = Array.isArray(v) ? v[0] : v;
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

export const ONE_MILLION = 1_000_000;
