"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, Sparkles, Trophy, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuSheet } from "./menu-sheet";

function Tab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.75} />
      <span className="text-[0.62rem] font-medium tracking-wide">{label}</span>
      <span
        className={cn(
          "h-1 w-1 rounded-full transition-all",
          active ? "bg-accent" : "bg-transparent",
        )}
      />
    </Link>
  );
}

export function BottomNav({
  userName,
  userEmail,
  isAdmin,
}: {
  userName?: string;
  userEmail?: string;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-md"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex h-16 max-w-2xl items-stretch px-2">
        <Tab href="/" label="Home" icon={Home} active={isActive("/")} />
        <Tab href="/agents" label="Agents" icon={Bot} active={isActive("/agents")} />

        {/* Raised center: the €1M funnel */}
        <div className="relative flex w-20 flex-none items-center justify-center">
          <Link
            href="/build"
            aria-label="Build your set-up"
            className={cn(
              "absolute -top-5 flex h-14 w-14 flex-col items-center justify-center rounded-full text-primary-foreground shadow-lg ring-4 ring-background transition-transform active:scale-95",
              "bg-primary",
            )}
          >
            <Sparkles className="h-6 w-6" strokeWidth={1.75} />
          </Link>
          <span
            className={cn(
              "absolute bottom-2 text-[0.62rem] font-medium tracking-wide",
              isActive("/build") ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Build
          </span>
        </div>

        <Tab
          href="/millionaire"
          label="Quiz"
          icon={Trophy}
          active={isActive("/millionaire")}
        />
        <MenuSheet userName={userName} userEmail={userEmail} isAdmin={isAdmin} />
      </div>
    </nav>
  );
}
