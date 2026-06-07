import { LioMark } from "@/components/lio-logo";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <LioMark className="h-8 w-8 animate-pulse text-accent" />
      <p className="label-uppercase">Loading</p>
    </div>
  );
}
