import { redirect } from "next/navigation";
import { getCurrentParticipant, participantIsAdmin } from "@/lib/auth";
import { getBudgetState } from "@/lib/funnel";
import { AppHeader } from "@/components/app-shell/app-header";
import { AnnouncementBar } from "@/components/app-shell/announcement-bar";
import { BottomNav } from "@/components/app-shell/bottom-nav";

// Per-user shell: always render against the request's own session, so one
// user's header balance / page data is never cached and shown to another.
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/login");

  const { balance } = await getBudgetState(participant.id);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <AppHeader balance={balance} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-5 outline-none"
      >
        {children}
      </main>
      <BottomNav
        userName={participant.name}
        userEmail={participant.email}
        isAdmin={participantIsAdmin(participant)}
      />
    </div>
  );
}
