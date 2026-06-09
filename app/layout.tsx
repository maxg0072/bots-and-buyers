import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://botsandbuyers.app"),
  title: {
    default: "Bots & Buyers - Lio Agentic World",
    template: "%s · Bots & Buyers",
  },
  description:
    "The Bots & Buyers experience by Lio. Explore agentic procurement, build your perfect agent set-up, and see the ROI - live.",
  applicationName: "Bots & Buyers",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bots & Buyers",
  },
  formatDetection: { telephone: false },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Bots & Buyers - Lio Agentic World",
    description:
      "Build your perfect agent set-up and see the ROI - live. The Lio experience.",
    type: "website",
    url: "https://botsandbuyers.app",
    siteName: "Bots & Buyers",
  },
  // Favicon/app icon is provided by app/icon.svg (Next file convention).
};

export const viewport: Viewport = {
  themeColor: "#F7F5F2",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
