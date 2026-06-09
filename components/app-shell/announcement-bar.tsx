import { Megaphone } from "lucide-react";

const MESSAGE =
  "Post about Bots & Buyers and tag Lio to win a 1:1 with our co-founder & CTO";

/**
 * Thin, horizontally-scrolling announcement ticker at the very top of the app.
 * The message is repeated and the track animates by -50% for a seamless loop
 * (pauses for prefers-reduced-motion - see .lio-marquee in globals.css).
 */
export function AnnouncementBar() {
  return (
    <div
      data-agent="p2s"
      aria-label="Announcement"
      className="overflow-hidden border-b border-agent/20 bg-agent/12"
    >
      <div className="lio-marquee flex w-max items-center py-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="flex items-center gap-2 whitespace-nowrap px-6 text-xs font-medium text-foreground"
          >
            <Megaphone className="h-3.5 w-3.5 shrink-0 text-agent" aria-hidden />
            {MESSAGE}
          </span>
        ))}
      </div>
    </div>
  );
}
