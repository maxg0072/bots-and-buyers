import type { Metadata } from "next";
import { CalendarCheck, Cpu, Compass } from "lucide-react";
import { EngagementForm } from "@/components/connect/engagement-form";
import { DemoBooking } from "@/components/connect/demo-booking";

export const metadata: Metadata = { title: "Take it further" };

// TODO: replace with Lio's real Calendly link (e.g. https://calendly.com/asklio/demo).
const CALENDLY_URL = "https://calendly.com/lio/demo";

export default function ConnectPage() {
  return (
    <div className="space-y-7">
      <header className="lio-rise">
        <p className="label-uppercase mb-2 text-muted-foreground">Work with the team</p>
        <h1 className="text-4xl leading-[1.05] text-foreground">Take it further</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Three ways to keep going with the Lio team after the event - pick what fits, no pressure.
        </p>
      </header>

      {/* 1 - Live demo, booked via Calendly */}
      <section
        data-agent="s2c"
        className="lio-rise lio-rise-1 lio-accent-rail shadow-lio rounded-lg border border-border bg-card p-5 pl-6"
      >
        <p className="label-uppercase flex items-center gap-2 text-agent">
          <CalendarCheck className="h-3.5 w-3.5" /> See it live
        </p>
        <h2 className="mt-2 text-xl leading-tight text-foreground">A live demo with our team</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Grab 30 minutes with one of our account executives and see Lio work on your real
          procurement questions. Pick a slot that suits you - we&apos;ll take it from there.
        </p>
        <DemoBooking url={CALENDLY_URL} />
      </section>

      {/* 2 - Forward Deployed Engineering (request form) */}
      <section
        data-agent="services"
        className="lio-rise lio-rise-2 lio-accent-rail shadow-lio rounded-lg border border-border bg-card p-5 pl-6"
      >
        <p className="label-uppercase flex items-center gap-2 text-agent">
          <Cpu className="h-3.5 w-3.5" /> Forward Deployed Engineering
        </p>
        <h2 className="mt-2 text-xl leading-tight text-foreground">Have our engineers build with you</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Our Forward Deployed Engineers come on-site, dig into your infrastructure and IT setup,
          and build custom solutions for your procurement workflows. It&apos;s a hands-on, paid
          engagement - leave a few details and we&apos;ll reach out after the event to scope it with
          you.
        </p>
        <EngagementForm
          type="fde"
          accent="services"
          placeholder="A few words on your setup - ERP/systems, team, the workflows you'd want us to tackle."
        />
      </section>

      {/* 3 - Agentic Assessment (request form) */}
      <section
        data-agent="p2p"
        className="lio-rise lio-rise-3 lio-accent-rail shadow-lio rounded-lg border border-border bg-card p-5 pl-6"
      >
        <p className="label-uppercase flex items-center gap-2 text-agent">
          <Compass className="h-3.5 w-3.5" /> Agentic Assessment
        </p>
        <h2 className="mt-2 text-xl leading-tight text-foreground">Map your agentic use cases</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A working call where we look at your procurement together and map the agentic use cases
          worth building - where to start, what&apos;s feasible, and the impact it could have. Tell us
          a little and we&apos;ll follow up after the event.
        </p>
        <EngagementForm
          type="assessment"
          accent="p2p"
          placeholder="What would you want to explore? Categories, pain points, where you'd start."
        />
      </section>
    </div>
  );
}
