import type { Metadata } from "next";
import { WORKSHOP_SLOTS } from "@/lib/content/workshops";

export const metadata: Metadata = { title: "Workshops" };

function Room({ label, title, accent }: { label: string; title: string; accent: string }) {
  return (
    <div
      data-agent={accent}
      className="lio-accent-rail rounded-md border border-border bg-card/60 p-3 pl-4"
    >
      <p className="label-uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm leading-snug text-foreground">{title}</p>
    </div>
  );
}

export default function WorkshopsPage() {
  return (
    <div className="space-y-6">
      <header className="lio-rise">
        <p className="label-uppercase mb-2 text-muted-foreground">Two rooms, five sessions</p>
        <h1 className="text-4xl leading-[1.05] text-foreground">Workshops</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Five parallel sessions across two rooms, 13:00-17:05. Drop in to whichever fits.
        </p>
      </header>

      <div className="space-y-3">
        {WORKSHOP_SLOTS.map((s, i) => (
          <article
            key={s.time}
            className={`lio-rise shadow-lio rounded-lg border border-border bg-card p-5 lio-rise-${Math.min(i + 1, 5)}`}
          >
            <p className="display-num text-sm tabular-nums text-foreground">{s.time}</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <Room label="Room 1" title={s.room1} accent="s2c" />
              <Room label="Room 2" title={s.room2} accent="p2s" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
