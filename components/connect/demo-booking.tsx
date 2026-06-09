"use client";

import { ArrowUpRight } from "lucide-react";
import { submitEngagement } from "@/app/(app)/connect/actions";

/** Opens the booking calendar (Calendly) in a new tab and logs the lead for sales. */
export function DemoBooking({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        void submitEngagement({ type: "demo", details: "Opened the demo calendar." }).catch(() => {});
      }}
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.99]"
    >
      Pick a time <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}
