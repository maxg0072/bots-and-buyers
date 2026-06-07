import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bots & Buyers - Lio Agentic World",
    short_name: "Bots & Buyers",
    description:
      "Build your perfect agent set-up and see the ROI - live. The Lio experience.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F5F2",
    theme_color: "#F7F5F2",
    orientation: "portrait",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
