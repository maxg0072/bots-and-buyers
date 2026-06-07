"use client";

import Link from "next/link";
import { LioMark } from "@/components/lio-logo";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <LioMark className="h-8 w-8 text-accent" />
      <p className="label-uppercase text-muted-foreground">Something went wrong</p>
      <h1 className="text-2xl text-foreground">A small glitch</h1>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
        Try again - anything you&apos;ve built is saved to your email.
      </p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform active:scale-95"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
