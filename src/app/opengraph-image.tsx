import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PINGWASH — Le laveur qui protège la banquise";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #e0f2fe 0%, #ffffff 40%, #f0f9ff 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 80px",
        }}
      >
        {/* Left side - text */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "55%" }}>
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              borderRadius: "999px",
              padding: "8px 20px",
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "24px",
              width: "fit-content",
            }}
          >
            🌍 Jusqu&apos;à 99% d&apos;eau économisée
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "52px",
              fontWeight: 900,
              color: "#0c1e2c",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            Votre véhicule lavé.
          </div>
          <div
            style={{
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "24px",
              background: "linear-gradient(135deg, #0ea5e9, #10b981)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            La banquise protégée.
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "22px",
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            Lavage auto, moto & vélo à domicile ou en entreprise. Écologique, rapide et intelligent.
          </div>

          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "32px",
              fontSize: "28px",
              fontWeight: 800,
              color: "#0c1e2c",
            }}
          >
            🐧 PING
            <span style={{ color: "#0ea5e9" }}>WASH</span>
          </div>
        </div>

        {/* Right side - penguin illustration */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "400px",
            height: "400px",
            position: "relative",
          }}
        >
          {/* Circle background */}
          <div
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(14, 165, 233, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "180px",
            }}
          >
            🐧
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
