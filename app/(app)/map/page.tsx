import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { MAP_IMAGE, POIS, VENUE_IS_PLACEHOLDER } from "@/lib/content/venue";
import { EVENT } from "@/lib/content/event";
import { SampleBanner } from "@/components/content/sample-banner";

export const metadata: Metadata = { title: "Lageplan" };

export default function MapPage() {
  return (
    <div className="space-y-6">
      <header className="lio-rise">
        <p className="label-uppercase mb-2 text-muted-foreground">{EVENT.venue}</p>
        <h1 className="text-4xl leading-[1.05] text-foreground">Lageplan</h1>
      </header>

      {VENUE_IS_PLACEHOLDER && (
        <SampleBanner>
          Drop the floor plan at{" "}
          <code className="rounded bg-card px-1 py-0.5 text-foreground">/public/lageplan.png</code>{" "}
          and set <code className="rounded bg-card px-1 py-0.5 text-foreground">MAP_IMAGE</code> in{" "}
          <code className="rounded bg-card px-1 py-0.5 text-foreground">lib/content/venue.ts</code>.
        </SampleBanner>
      )}

      {MAP_IMAGE ? (
        <div className="lio-rise overflow-hidden rounded-lg border border-border bg-card">
          <Image
            src={MAP_IMAGE}
            alt="Venue floor plan"
            width={1200}
            height={900}
            className="h-auto w-full"
          />
        </div>
      ) : (
        <div className="lio-stage lio-rise flex aspect-[4/3] items-center justify-center rounded-lg border border-border" data-agent="others">
          <p className="label-uppercase text-muted-foreground">Floor plan</p>
        </div>
      )}

      <section className="lio-rise lio-rise-1 space-y-2">
        <h2 className="text-lg text-foreground">Points of interest</h2>
        <div className="space-y-2">
          {POIS.map((poi) => (
            <div
              key={poi.id}
              className="flex items-start gap-3 rounded-md border border-border bg-card p-3.5 shadow-lio"
              data-agent="s2c"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-agent/10 text-agent">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm text-foreground">{poi.label}</p>
                {poi.note && (
                  <p className="text-xs leading-snug text-muted-foreground">{poi.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
