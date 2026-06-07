import { ImageResponse } from "next/og";

export const alt = "Bots & Buyers - Lio Agentic World";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg, #F7F5F2 0%, #EFEBE6 100%)",
          color: "#0A1624",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "999px", background: "#447279" }} />
          <div style={{ fontSize: 30, letterSpacing: "10px", color: "#525F6F" }}>
            LIO · AGENTIC WORLD
          </div>
        </div>
        <div style={{ fontSize: 132, marginTop: "18px", fontWeight: 600, letterSpacing: "-3px" }}>
          Bots &amp; Buyers
        </div>
        <div style={{ fontSize: 40, marginTop: "26px", color: "#525F6F", maxWidth: "900px", lineHeight: 1.3 }}>
          Build your perfect agent set-up. Spend your €1M. See the ROI - live.
        </div>
      </div>
    ),
    size,
  );
}
