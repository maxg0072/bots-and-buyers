import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LioLogo } from "@/components/lio-logo";
import { Button } from "@/components/ui/button";

export function AdminGate() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 py-12"
      data-agent="services"
    >
      <div className="w-full max-w-xs">
        <div className="mb-8 text-center">
          <LioLogo className="mx-auto h-7 text-foreground" />
          <p className="label-uppercase mt-6 flex items-center justify-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Sales dashboard
          </p>
          <h1 className="mt-2 text-2xl text-foreground">Admin access</h1>
        </div>

        <div className="space-y-4 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            The dashboard is restricted to the Lio admin account. Sign in with
            the admin email to continue.
          </p>
          <Button render={<Link href="/login" />} className="h-11 w-full">
            Go to sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
