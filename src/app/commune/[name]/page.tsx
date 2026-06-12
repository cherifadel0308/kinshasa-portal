"use client";

import { use } from "react";
import Link from "next/link";
import { getCommuneByName, SECURITY_COLOR, SECURITY_LABEL } from "@/lib/communes";

export default function CommunePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const commune = getCommuneByName(name);

  if (!commune) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        color: "#e2e8f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        gap: 16,
      }}>
        <div style={{ fontSize: 48 }}>❓</div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Commune not found</h1>
        <p style={{ color: "#64748b" }}>"{decodeURIComponent(name)}" doesn't match any commune.</p>
        <Link href="/" style={{
          background: "linear-gradient(135deg, #e11d48, #7c3aed)",
          color: "#fff", padding: "10px 22px",
          borderRadius: 10, textDecoration: "none", fontWeight: 600, fontSize: 14,
        }}>
          ← Back to Map
        </Link>
      </main>
    );
  }

  const secColor = SECURITY_COLOR[commune.security];

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      color: "#e2e8f0",
      fontFamily: "Inter, -apple-system, sans-serif",
    }}>

      {/* TOPBAR */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <Link href="/" style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#e2e8f0",
          borderRadius: 8,
          padding: "7px 16px",
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          ← Back to Map
        </Link>
        <div style={{ fontSize: 13, color: "#64748b" }}>
          Kinshasa Portal{" "}
          <span style={{ color: "#475569" }}>→</span>{" "}
          <strong style={{ color: "#cbd5e1" }}>{commune.name}</strong>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 28px" }}>

        {/* TITLE */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: "#64748b",
            textTransform: "uppercase", marginBottom: 8,
          }}>
            Commune de
          </div>
          <h1 style={{ fontSize: 50, fontWeight: 800, margin: "0 0 14px", letterSpacing: -1.5 }}>
            {commune.name}
          </h1>
          <div style={{
            width: 64, height: 4,
            background: "linear-gradient(90deg, #e11d48, #a855f7)",
            borderRadius: 2,
          }} />
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
          {[
            { icon: "👥", label: "Population", value: commune.pop, color: undefined },
            { icon: "🛡️", label: "Security",   value: SECURITY_LABEL[commune.security], color: secColor },
            { icon: "📍", label: "District",   value: "Kinshasa", color: undefined },
          ].map((card) => (
            <div key={card.label} style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14, padding: "20px 16px", textAlign: "center",
            }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{card.icon}</div>
              <div style={{
                fontSize: 10, color: "#64748b", marginBottom: 5,
                textTransform: "uppercase", letterSpacing: 1.5,
              }}>
                {card.label}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: card.color ?? "#e2e8f0" }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* INFO */}
        <div style={{
          background: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.25)",
          borderRadius: 16, padding: 28, marginBottom: 18,
        }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>ℹ️</span>
            <div>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, color: "#93c5fd", fontWeight: 700 }}>
                About this commune
              </h3>
              <p style={{ margin: 0, lineHeight: 1.75, color: "#cbd5e1", fontSize: 14 }}>
                {commune.info}
              </p>
            </div>
          </div>
        </div>

        {/* CULTURE */}
        <div style={{
          background: "rgba(168,85,247,0.08)",
          border: "1px solid rgba(168,85,247,0.25)",
          borderRadius: 16, padding: 28, marginBottom: 18,
        }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>🎭</span>
            <div>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, color: "#d8b4fe", fontWeight: 700 }}>
                Culture & Identity
              </h3>
              <p style={{ margin: 0, lineHeight: 1.75, color: "#cbd5e1", fontSize: 14 }}>
                {commune.culture}
              </p>
            </div>
          </div>
        </div>

        {/* SECURITY */}
        <div style={{
          background: `${secColor}12`,
          border: `1px solid ${secColor}44`,
          borderRadius: 16, padding: 28,
        }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>🛡️</span>
            <div>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, color: secColor, fontWeight: 700 }}>
                Security Status: {SECURITY_LABEL[commune.security]}
              </h3>
              <p style={{ margin: 0, lineHeight: 1.75, color: "#cbd5e1", fontSize: 14 }}>
                {commune.security === "high" &&
                  "This commune is considered one of the most stable areas in Kinshasa, with strong institutional presence and lower crime rates relative to the city average."}
                {commune.security === "medium" &&
                  "Moderate security environment. Normal urban precautions apply. The commune benefits from active community policing and reasonable infrastructure."}
                {commune.security === "low" &&
                  "This commune faces elevated security challenges typical of high-density informal urban areas. Caution is advised, particularly after dark."}
              </p>
            </div>
          </div>
        </div>

        {/* BACK LINK */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "#64748b", textDecoration: "none", fontSize: 13,
            borderBottom: "1px solid transparent",
          }}>
            ← Back to the Kinshasa map
          </Link>
        </div>
      </div>
    </main>
  );
}
