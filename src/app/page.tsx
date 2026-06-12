"use client";

import { useState } from "react";
import Link from "next/link";
import { COMMUNES, SECURITY_COLOR, SECURITY_LABEL, type Commune, type SecurityLevel } from "@/lib/communes";

type Layer = "default" | "info" | "security" | "culture";

const LAYERS: { id: Layer; label: string; icon: string }[] = [
  { id: "default",  label: "Overview",  icon: "🗺️" },
  { id: "info",     label: "Info",      icon: "ℹ️" },
  { id: "security", label: "Security",  icon: "🛡️" },
  { id: "culture",  label: "Culture",   icon: "🎭" },
];

function getDotColor(c: Commune, layer: Layer): string {
  if (layer === "security") return SECURITY_COLOR[c.security];
  if (layer === "culture")  return "#a855f7";
  if (layer === "info")     return "#3b82f6";
  return "#e11d48";
}

function KinshasaMap({
  layer,
  selected,
  onSelect,
}: {
  layer: Layer;
  selected: Commune | null;
  onSelect: (c: Commune) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <svg
      viewBox="140 160 480 200"
      style={{ width: "100%", height: "100%", fontFamily: "Inter, sans-serif" }}
    >
      {/* Congo River */}
      <path
        d="M140 175 Q180 165 220 172 Q260 178 300 170 Q340 162 380 168 Q420 174 460 165 Q500 156 540 162 Q580 168 620 160"
        fill="none" stroke="#93c5fd" strokeWidth="14" strokeLinecap="round" opacity="0.3"
      />
      <text x="148" y="172" fontSize="7" fill="#93c5fd" opacity="0.6">Congo River</text>

      {COMMUNES.map((c) => {
        const isHov = hovered === c.id;
        const isSel = selected?.id === c.id;
        const color = getDotColor(c, layer);
        const r = isSel ? 11 : isHov ? 10 : 8;
        return (
          <g
            key={c.id}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(c)}
            onMouseEnter={() => setHovered(c.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <circle cx={c.x} cy={c.y} r={r + 5} fill={color} opacity={0.12} />
            <circle
              cx={c.x} cy={c.y} r={r}
              fill={color}
              opacity={isSel ? 1 : isHov ? 0.9 : 0.65}
              stroke={isSel ? "#fff" : isHov ? "#fff" : "rgba(255,255,255,0.3)"}
              strokeWidth={isSel ? 2.5 : 1.5}
            />
            {(isHov || isSel) && (
              <text
                x={c.x} y={c.y - r - 5}
                textAnchor="middle" fontSize="6.5" fill="#fff"
                style={{ pointerEvents: "none", fontWeight: 700 }}
              >
                {c.name}
              </text>
            )}
          </g>
        );
      })}

      {/* Security legend */}
      {layer === "security" && (
        <g>
          {(["high", "medium", "low"] as SecurityLevel[]).map((lvl, i) => (
            <g key={lvl} transform={`translate(${155 + i * 75}, 348)`}>
              <circle cx={0} cy={0} r={5} fill={SECURITY_COLOR[lvl]} opacity={0.85} />
              <text x={9} y={4} fontSize="7" fill="#e2e8f0">{SECURITY_LABEL[lvl]}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

export default function HomePage() {
  const [layer, setLayer] = useState<Layer>("default");
  const [selected, setSelected] = useState<Commune | null>(null);

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      color: "#e2e8f0",
      fontFamily: "Inter, -apple-system, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* NAV */}
      <nav style={{
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #e11d48, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>🌍</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>Kinshasa Portal</div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 1.5, textTransform: "uppercase" }}>
              République Démocratique du Congo
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#475569" }}>{COMMUNES.length} Communes</span>
          <Link
            href="/login"
            style={{
              background: "rgba(220,38,38,0.2)",
              border: "1px solid rgba(220,38,38,0.4)",
              color: "#fca5a5",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Journalist Access
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "32px 24px 0" }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, margin: "0 0 10px", letterSpacing: -1 }}>
          Explore{" "}
          <span style={{
            background: "linear-gradient(90deg, #e11d48, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Kinshasa</span>
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Click any commune on the map — use the filters to change what is displayed
        </p>
      </div>

      {/* LAYER BUTTONS */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 10,
        padding: "20px 24px 0", flexWrap: "wrap",
      }}>
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLayer(l.id)}
            style={{
              background: layer === l.id
                ? "linear-gradient(135deg, #e11d48, #7c3aed)"
                : "rgba(255,255,255,0.07)",
              border: layer === l.id ? "none" : "1px solid rgba(255,255,255,0.12)",
              color: "#e2e8f0",
              borderRadius: 100,
              padding: "9px 22px",
              fontSize: 13,
              fontWeight: layer === l.id ? 700 : 400,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
              boxShadow: layer === l.id ? "0 4px 16px rgba(225,29,72,0.35)" : "none",
              transition: "all 0.15s",
            }}
          >
            {l.icon} {l.label}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div style={{
        display: "flex",
        flex: 1,
        gap: 16,
        padding: "20px 24px 28px",
        maxWidth: 1120,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}>

        {/* MAP */}
        <div style={{
          flex: 1,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          overflow: "hidden",
          position: "relative",
          minHeight: 360,
        }}>
          <KinshasaMap layer={layer} selected={selected} onSelect={setSelected} />

          {layer !== "default" && (
            <div style={{
              position: "absolute", top: 14, right: 14,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 11,
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              {LAYERS.find((l) => l.id === layer)?.icon}{" "}
              Showing:{" "}
              <strong style={{ color: "#e2e8f0" }}>
                {LAYERS.find((l) => l.id === layer)?.label}
              </strong>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ width: 268, display: "flex", flexDirection: "column", gap: 12 }}>
          {selected ? (
            <>
              {/* Selected card */}
              <div style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: 20,
              }}>
                <div style={{
                  fontSize: 10, color: "#64748b", letterSpacing: 2,
                  textTransform: "uppercase", marginBottom: 6,
                }}>
                  Selected commune
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 14px", letterSpacing: -0.5 }}>
                  {selected.name}
                </h2>

                {layer === "info" && (
                  <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 14px" }}>
                    {selected.info}
                  </p>
                )}
                {layer === "culture" && (
                  <p style={{ fontSize: 12, color: "#d8b4fe", lineHeight: 1.7, margin: "0 0 14px" }}>
                    🎭 {selected.culture}
                  </p>
                )}
                {layer === "security" && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    background: `${SECURITY_COLOR[selected.security]}22`,
                    border: `1px solid ${SECURITY_COLOR[selected.security]}55`,
                    borderRadius: 8, padding: "7px 12px", marginBottom: 14,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: SECURITY_COLOR[selected.security],
                    }} />
                    <span style={{
                      fontSize: 13, fontWeight: 600,
                      color: SECURITY_COLOR[selected.security],
                    }}>
                      {SECURITY_LABEL[selected.security]}
                    </span>
                  </div>
                )}
                {layer === "default" && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    <div style={{
                      background: "rgba(255,255,255,0.06)", borderRadius: 8,
                      padding: "8px 10px", flex: 1, textAlign: "center",
                    }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>POP.</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{selected.pop}</div>
                    </div>
                    <div style={{
                      background: `${SECURITY_COLOR[selected.security]}18`,
                      border: `1px solid ${SECURITY_COLOR[selected.security]}44`,
                      borderRadius: 8, padding: "8px 10px", flex: 1, textAlign: "center",
                    }}>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>STATUS</div>
                      <div style={{
                        fontSize: 12, fontWeight: 700,
                        color: SECURITY_COLOR[selected.security],
                      }}>
                        {SECURITY_LABEL[selected.security]}
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  href={`/commune/${encodeURIComponent(selected.name)}`}
                  style={{
                    display: "block", width: "100%",
                    background: "linear-gradient(135deg, #e11d48, #7c3aed)",
                    border: "none", borderRadius: 10,
                    color: "#fff", fontSize: 13, fontWeight: 700,
                    padding: "12px 0", textAlign: "center", textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(225,29,72,0.3)",
                  }}
                >
                  Explore {selected.name} →
                </Link>
              </div>

              {/* Commune list */}
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 14,
              }}>
                <div style={{
                  fontSize: 10, color: "#475569", letterSpacing: 2,
                  textTransform: "uppercase", marginBottom: 10,
                }}>
                  All Communes
                </div>
                <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                  {[...COMMUNES].sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      style={{
                        background: selected.id === c.id ? "rgba(225,29,72,0.15)" : "transparent",
                        border: selected.id === c.id ? "1px solid rgba(225,29,72,0.35)" : "1px solid transparent",
                        borderRadius: 7, padding: "6px 10px",
                        color: selected.id === c.id ? "#fca5a5" : "#94a3b8",
                        fontSize: 12, textAlign: "left", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                    >
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: SECURITY_COLOR[c.security], opacity: 0.8, flexShrink: 0,
                      }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px dashed rgba(255,255,255,0.12)",
              borderRadius: 16, padding: 24,
              textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            }}>
              <div style={{ fontSize: 38 }}>📍</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>Select a commune</div>
              <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.7 }}>
                Click any dot on the map to see details about that commune.
              </div>

              <div style={{ marginTop: 8, width: "100%" }}>
                <div style={{
                  fontSize: 10, color: "#475569", letterSpacing: 2,
                  textTransform: "uppercase", marginBottom: 10,
                }}>
                  All {COMMUNES.length} communes
                </div>
                <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                  {[...COMMUNES].sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 7, padding: "6px 10px",
                        color: "#94a3b8", fontSize: 12, textAlign: "left", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                    >
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: SECURITY_COLOR[c.security], opacity: 0.7, flexShrink: 0,
                      }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
