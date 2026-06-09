import Link from "next/link";
import {
  Bot,
  Sparkles,
  Trophy,
  CalendarClock,
  MapPinned,
  GraduationCap,
  Handshake,
  Mail,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { LioMark } from "@/components/lio-logo";
import { getCurrentParticipant } from "@/lib/auth";
import { getSetupSnapshot } from "@/lib/funnel";
import { formatEur, formatEurFull, ONE_MILLION } from "@/lib/format";

type Cat = "services" | "srm" | "p2p" | "s2c" | "p2s" | "others";

const HUB: { href: string; label: string; desc: string; icon: LucideIcon; cat: Cat; wide?: boolean }[] = [
  { href: "/agents", label: "Agent Booklet", desc: "All 32 agents, six worlds", icon: Bot, cat: "p2p" },
  { href: "/me", label: "My set-up", desc: "Your agents & ROI", icon: Sparkles, cat: "services" },
  { href: "/agenda", label: "Agenda", desc: "What's on, and when", icon: CalendarClock, cat: "srm" },
  { href: "/workshops", label: "Workshops", desc: "Deep-dives & topics", icon: GraduationCap, cat: "s2c" },
  { href: "/map", label: "Lageplan", desc: "Find your way around", icon: MapPinned, cat: "others" },
  { href: "/millionaire", label: "Wer wird Millionär", desc: "Test your procurement IQ", icon: Trophy, cat: "p2s" },
  { href: "/connect", label: "Take it further", desc: "Demo, FDE motion or an agentic assessment", icon: Handshake, cat: "services", wide: true },
];

export default async function HomePage() {
  const participant = await getCurrentParticipant();
  const firstName = participant?.name?.split(/\s+/)[0];
  const snapshot = participant ? await getSetupSnapshot(participant.id) : null;
  const hasSetup = !!snapshot && snapshot.items.length > 0;

  // TODO: replace "xxxx" with the real Bots & Buyers offer (e.g. "3 months free").
  const dealOffer = "xxxx";
  const wishlist = hasSetup
    ? snapshot!.items.map((i) => `- ${i.name}`).join("\n")
    : "- (add the agents you're most interested in)";
  const dealMailto =
    "mailto:info@lio.ai?subject=" +
    encodeURIComponent("Bots & Buyers - my agent wishlist") +
    "&body=" +
    encodeURIComponent(
      `Hi Lio team,\n\nI'd love to take you up on the Bots & Buyers deal. Here's my agent wishlist:\n\n${wishlist}\n\nLooking forward to a call with one of your engineers!`,
    );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="lio-rise" data-agent="s2c">
        <p className="label-uppercase mb-3 flex items-center gap-2 text-muted-foreground">
          <LioMark className="h-3.5 w-3.5 text-agent" />
          Lio · Agentic World
        </p>
        <h1 className="text-balance text-4xl leading-[1.05] text-foreground sm:text-5xl">
          Welcome to <span className="lio-mega">Bots&nbsp;&amp;&nbsp;Buyers</span>
        </h1>
        <p className="mt-4 max-w-md text-[0.975rem] leading-relaxed text-muted-foreground">
          {firstName ? `Hi ${firstName} - ` : ""}explore the agents reshaping
          procurement, build the set-up you&apos;d actually deploy, and watch the
          ROI add up - live.
        </p>
      </section>

      {/* €1M budget CTA - reflects real progress */}
      <Link
        href="/build"
        data-agent="s2c"
        className="lio-rise lio-rise-1 lio-surface-light block rounded-lg p-6 transition-transform active:scale-[0.99]"
      >
        <p className="label-uppercase text-muted-foreground">
          {hasSetup ? "Your budget left" : "Your conviction budget"}
        </p>
        <p className="display-num mt-2 text-[2.75rem] leading-none text-foreground sm:text-6xl">
          {formatEurFull(hasSetup ? snapshot!.balance : ONE_MILLION)}
        </p>
        {hasSetup ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {snapshot!.items.length} agent{snapshot!.items.length > 1 ? "s" : ""} backed ·{" "}
            <span className="text-agent">{formatEur(snapshot!.hardEur)}/yr</span> +{" "}
            {snapshot!.ftes >= 10 ? Math.round(snapshot!.ftes) : snapshot!.ftes.toFixed(1)} FTEs modeled.
          </p>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Back the agents you&apos;d put to work. Spend your million, shape your
            ROI, and send it to your team in one tap.
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-agent px-4 py-2 text-sm font-medium text-agent-foreground">
          {hasSetup ? "Continue your set-up" : "Build your set-up"}
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>

      {/* Section grid */}
      <section className="space-y-4">
        <div className="lio-hairline" />
        <div className="grid grid-cols-2 gap-3">
          {HUB.map(({ href, label, desc, icon: Icon, cat, wide }, i) => (
            <Link
              key={href}
              href={href}
              data-agent={cat}
              className={`lio-accent-rail shadow-lio lio-rise group relative flex flex-col gap-3 rounded-md border border-border bg-card p-4 pl-5 transition-transform hover:-translate-y-0.5 lio-rise-${Math.min(i + 1, 5)}${wide ? " col-span-2" : ""}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-agent/10 text-agent">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[1.02rem] leading-tight text-foreground">{label}</span>
                <span className="text-xs leading-snug text-muted-foreground">{desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Bots & Buyers deal - email your agent wishlist to info@lio.ai */}
      <a
        href={dealMailto}
        data-agent="p2s"
        className="lio-rise lio-surface-light block rounded-lg p-6 transition-transform active:scale-[0.99]"
      >
        <p className="label-uppercase text-muted-foreground">Special Bots &amp; Buyers deal</p>
        <p className="display-num mt-2 text-3xl leading-none text-foreground">Get {dealOffer}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Email your agent wishlist to info@lio.ai - we&apos;ll reach out and set you up with a call
          with one of our engineers.
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-agent px-4 py-2 text-sm font-medium text-agent-foreground">
          <Mail className="h-4 w-4" /> Email your wishlist
        </span>
      </a>
    </div>
  );
}
