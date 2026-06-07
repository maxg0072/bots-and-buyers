import type { Metadata } from "next";
import { MapPin, Clock, User } from "lucide-react";
import { WORKSHOPS, WORKSHOPS_IS_PLACEHOLDER } from "@/lib/content/workshops";
import { SampleBanner } from "@/components/content/sample-banner";

export const metadata: Metadata = { title: "Workshops" };

export default function WorkshopsPage() {
  return (
    <div className="space-y-6">
      <header className="lio-rise">
        <p className="label-uppercase mb-2 text-muted-foreground">Deep-dives &amp; topics</p>
        <h1 className="text-4xl leading-[1.05] text-foreground">Workshops</h1>
      </header>

      {WORKSHOPS_IS_PLACEHOLDER && (
        <SampleBanner>
          Sample workshops - edit{" "}
          <code className="rounded bg-card px-1 py-0.5 text-foreground">lib/content/workshops.ts</code>.
        </SampleBanner>
      )}

      <div className="space-y-3">
        {WORKSHOPS.map((w) => (
          <article
            key={w.id}
            data-agent={w.accent ?? "others"}
            className="lio-accent-rail lio-rise shadow-lio rounded-lg border border-border bg-card p-5 pl-6"
          >
            <h2 className="text-xl leading-tight text-foreground">{w.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {w.host && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" /> {w.host}
                </span>
              )}
              {w.room && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {w.room}
                </span>
              )}
              {w.time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {w.time}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.summary}</p>
            {w.topics?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {w.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-agent/30 bg-agent/8 px-2.5 py-1 text-[0.7rem] text-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
