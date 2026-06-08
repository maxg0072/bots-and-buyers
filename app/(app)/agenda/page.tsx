import type { Metadata } from "next";
import { AGENDA, AGENDA_IS_PLACEHOLDER, type SessionKind } from "@/lib/content/agenda";
import { EVENT } from "@/lib/content/event";
import { SampleBanner } from "@/components/content/sample-banner";

export const metadata: Metadata = { title: "Agenda" };

const KIND: Record<SessionKind, { label: string; agent: string }> = {
  keynote: { label: "Keynote", agent: "services" },
  talk: { label: "Talk", agent: "s2c" },
  demo: { label: "Demo", agent: "p2p" },
  workshop: { label: "Workshop", agent: "srm" },
  break: { label: "Break", agent: "others" },
  networking: { label: "Networking", agent: "p2s" },
};

export default function AgendaPage() {
  return (
    <div className="space-y-6">
      <header className="lio-rise">
        <p className="label-uppercase mb-2 text-muted-foreground">{EVENT.dateLabel}</p>
        <h1 className="text-4xl leading-[1.05] text-foreground">Agenda</h1>
      </header>

      {AGENDA_IS_PLACEHOLDER && (
        <SampleBanner>
          Sample programme - final agenda coming. Edit{" "}
          <code className="rounded bg-card px-1 py-0.5 text-foreground">lib/content/agenda.ts</code>.
        </SampleBanner>
      )}

      {AGENDA.map((day) => (
        <section key={day.label} className="lio-rise space-y-1">
          <ol className="relative">
            {day.sessions.map((s) => {
              const kind = KIND[s.kind];
              const muted = s.kind === "break";
              return (
                <li
                  key={s.id}
                  data-agent={kind.agent}
                  className="flex gap-4 border-l-2 border-border py-3 pl-4"
                >
                  <div className="w-12 shrink-0">
                    <p className="display-num text-sm tabular-nums text-foreground">{s.start}</p>
                    <p className="text-[0.65rem] text-muted-foreground">{s.end}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`leading-tight ${muted ? "text-sm text-muted-foreground" : "text-[1.02rem] text-foreground"}`}
                    >
                      {s.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      {!muted && (
                        <span className="rounded-full bg-agent/12 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-agent">
                          {kind.label}
                        </span>
                      )}
                      {s.speaker && <span>{s.speaker}</span>}
                      {s.location && <span>· {s.location}</span>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
