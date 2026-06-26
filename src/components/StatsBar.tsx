"use client";

import { memo } from "react";

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  elapsed: number;
  theme: "light" | "dark";
}

function ProgressRing({
  value,
  max,
  size = 48,
  strokeWidth = 3,
  color,
  children,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  children: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value / max, 1);
  const offset = circumference * (1 - percent);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          style={{ opacity: 0.08 }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {children}
      </div>
    </div>
  );
}

export default memo(function StatsBar({ wpm, accuracy, elapsed, theme }: StatsBarProps) {
  const isDark = theme === "dark";

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const getAccuracyColor = () => {
    if (accuracy >= 90) return "var(--success)";
    if (accuracy >= 70) return "var(--warning)";
    if (accuracy > 0) return "var(--error)";
    return isDark ? "var(--muted-dark)" : "var(--muted-light)";
  };

  const cardStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "10px 16px",
    borderRadius: "var(--radius-md)",
    background: isDark
      ? "linear-gradient(135deg, rgba(30,41,59,0.5), rgba(15,23,42,0.3))"
      : "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(248,250,252,0.5))",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
  };

  const accuracyPercent = accuracy || 0;

  const statItem = (
    ring: React.ReactNode,
    value: string | number,
    label: string,
    color: string,
  ) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {ring}
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
          {value}
        </div>
        <div style={{
          fontSize: 10,
          fontWeight: 600,
          color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}>
          {label}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      display: "flex",
      gap: 8,
      marginBottom: 12,
      animation: "slideUp 0.5s ease-out",
    }}>
      <div style={cardStyle}>
        {statItem(
          <ProgressRing value={wpm} max={100} size={44} strokeWidth={3} color="var(--primary)">
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)", lineHeight: 1 }}>{wpm}</span>
          </ProgressRing>,
          "", "", "var(--primary)",
        )}
      </div>
      <div style={cardStyle}>
        {statItem(
          <ProgressRing value={accuracyPercent} max={100} size={44} strokeWidth={3} color={getAccuracyColor()}>
            <span style={{ fontSize: 14, fontWeight: 700, color: getAccuracyColor(), lineHeight: 1 }}>{accuracyPercent}</span>
          </ProgressRing>,
          "", "", getAccuracyColor(),
        )}
      </div>
      <div style={cardStyle}>
        {statItem(
          <ProgressRing value={elapsed % 60} max={60} size={44} strokeWidth={3} color="var(--accent)">
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{formatTime(elapsed)}</span>
          </ProgressRing>,
          "", "", "var(--accent)",
        )}
      </div>
    </div>
  );
});
