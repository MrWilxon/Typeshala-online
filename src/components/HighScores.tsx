"use client";

import { TrophyIcon } from "./Icons";

interface MergedScore {
  wpm: number;
  accuracy: number;
  setType: string;
  source: "local" | "backend";
  timestamp?: number;
}

interface HighScoresProps {
  scores: MergedScore[];
  theme: "light" | "dark";
}

export function HighScores({ scores, theme }: HighScoresProps) {
  const isDark = theme === "dark";

  return (
    <section aria-label="High Scores" style={{ animation: "slideUp 0.3s ease-out" }}>
      <div style={{
        background: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "var(--radius-lg)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        padding: 24,
        boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.2)" : "0 4px 24px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <TrophyIcon />
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>High Scores</h2>
        </div>
        {scores.length === 0 ? (
          <p style={{ fontSize: 13, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>
            No scores yet. Complete a lesson to see your score here.
          </p>
        ) : (
          <div style={{ maxHeight: 300, overflowY: "auto", margin: "0 -8px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>#</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>WPM</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>Accuracy</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>Set</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`, transition: "background var(--transition)" }}>
                    <td style={{ padding: "8px 12px", color: isDark ? "var(--muted-dark)" : "var(--muted-light)", fontSize: 11 }}>{i + 1}</td>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--primary)" }}>{s.wpm}</td>
                    <td style={{ padding: "8px 12px" }}>{s.accuracy}%</td>
                    <td style={{ padding: "8px 12px", color: isDark ? "var(--muted-dark)" : "var(--muted-light)", fontSize: 12 }}>{s.setType}</td>
                    <td style={{ padding: "8px 12px" }}>
                      <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: s.source === "local" ? "rgba(34,197,94,0.1)" : "rgba(99,102,241,0.1)", color: s.source === "local" ? "var(--success)" : "var(--primary)" }}>
                        {s.source === "local" ? "Local" : "Server"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
