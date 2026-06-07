import Link from "next/link";
import { LioMark } from "@/components/lio-logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <LioMark className="h-8 w-8 text-accent" />
      <p className="display-num text-6xl leading-none text-foreground">404</p>
      <p className="text-sm text-muted-foreground">This page wandered off.</p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform active:scale-95"
      >
        Back to home
      </Link>
    </div>
  );
}
