"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
  CalendarClock,
  MapPinned,
  GraduationCap,
  User,
  ShieldCheck,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS: { href: string; label: string; icon: LucideIcon; desc: string }[] = [
  { href: "/me", label: "My set-up", icon: User, desc: "Your agents & ROI" },
  { href: "/agenda", label: "Agenda", icon: CalendarClock, desc: "Sessions & timings" },
  { href: "/workshops", label: "Workshops", icon: GraduationCap, desc: "Topics & rooms" },
  { href: "/map", label: "Lageplan", icon: MapPinned, desc: "Find your way around" },
];

const rowClass =
  "group flex items-center gap-4 rounded-md px-3 py-3 transition-colors";

function Row({
  icon: Icon,
  label,
  desc,
}: {
  icon: LucideIcon;
  label: string;
  desc: string;
}) {
  return (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <span className="flex flex-col">
        <span className="text-[0.95rem] text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{desc}</span>
      </span>
    </>
  );
}

export function MenuSheet({
  userName,
  userEmail,
  isAdmin,
}: {
  userName?: string;
  userEmail?: string;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
        <Menu className="h-5 w-5" strokeWidth={1.75} />
        <span className="text-[0.62rem] font-medium tracking-wide">Menu</span>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-[88vw] max-w-sm flex-col gap-0 border-l p-0">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="label-uppercase text-muted-foreground">
            Bots &amp; Buyers
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-3">
          {LINKS.map(({ href, label, icon, desc }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <SheetClose
                key={href}
                nativeButton={false}
                render={
                  <Link
                    href={href}
                    className={cn(rowClass, active ? "bg-secondary" : "hover:bg-secondary/60")}
                  />
                }
              >
                <Row icon={icon} label={label} desc={desc} />
              </SheetClose>
            );
          })}

          {isAdmin && (
            <SheetClose
              nativeButton={false}
              render={
                <Link href="/admin" className={cn(rowClass, "mt-1 hover:bg-secondary/60")} />
              }
            >
              <Row icon={ShieldCheck} label="Admin" desc="Sales dashboard" />
            </SheetClose>
          )}
        </nav>

        {(userName || userEmail) && (
          <div className="mt-auto border-t border-border px-6 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{userName}</p>
                <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log out
                </button>
              </form>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
