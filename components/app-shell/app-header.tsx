import Link from "next/link";
import { Coins } from "lucide-react";
import { LioLogo } from "@/components/lio-logo";
import { formatEur } from "@/lib/format";

export function AppHeader({
  balance,
  showBalance = true,
}: {
  balance?: number;
  showBalance?: boolean;
}) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md"
      style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
    >
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4">
        <Link href="/" aria-label="Home" className="flex items-center text-foreground">
          <LioLogo className="h-6" />
        </Link>

        <span className="label-uppercase hidden text-muted-foreground sm:block">
          Bots &amp; Buyers
        </span>

        {showBalance ? (
          <Link
            href="/build"
            className="group flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-accent"
          >
            <Coins className="h-4 w-4 text-accent" strokeWidth={1.75} />
            <span className="display-num tabular-nums text-foreground">
              {formatEur(balance ?? 1_000_000)}
            </span>
            <span className="text-xs text-muted-foreground">left</span>
          </Link>
        ) : (
          <span className="w-6" />
        )}
      </div>
    </header>
  );
}
