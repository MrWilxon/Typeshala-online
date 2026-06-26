"use client";

import { useState, useEffect, useCallback } from "react";
import { STORAGE_STATS, STORAGE_STREAK } from "@/lib/storageKeys";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { BarChartIcon, RefreshIcon } from "./Icons";

interface StatsData {
  totalSessions: number;
  totalWordsTyped: number;
  averageWpm: number;
  bestWpm: number;
  averageAccuracy: number;
  bestAccuracy: number;
  totalTimeTyped: number;
  dailyStats: Record<string, { wpm: number; accuracy: number; sessions: number }>;
  recentSessions: Array<{ wpm: number; accuracy: number; timestamp: number; wordsTyped: number }>;
}

interface StatisticsDashboardProps {
  theme: "light" | "dark";
  refreshKey?: number;
}

const defaultStats: StatsData = {
  totalSessions: 0,
  totalWordsTyped: 0,
  averageWpm: 0,
  bestWpm: 0,
  averageAccuracy: 0,
  bestAccuracy: 0,
  totalTimeTyped: 0,
  dailyStats: {},
  recentSessions: [],
};

export function loadStats(): StatsData {
  return loadFromStorage<StatsData>(STORAGE_STATS, defaultStats);
}

function saveStats(stats: StatsData) {
  saveToStorage(STORAGE_STATS, stats);
}

export function exportStatsJSON() {
  const stats = loadStats();
  const blob = new Blob([JSON.stringify(stats, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `typeshala-stats-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportStatsCSV() {
  const stats = loadStats();
  const rows = [["Date", "WPM", "Accuracy", "Sessions"]];
  Object.entries(stats.dailyStats).forEach(([date, data]) => {
    rows.push([date, String(data.wpm), String(data.accuracy), String(data.sessions)]);
  });
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `typeshala-stats-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function recordSession(wpm: number, accuracy: number, wordsTyped: number, timeSeconds: number) {
  const stats = loadStats();
  stats.totalSessions++;
  stats.totalWordsTyped += wordsTyped;
  stats.totalTimeTyped += timeSeconds;

  const totalWpm = stats.averageWpm * (stats.totalSessions - 1) + wpm;
  stats.averageWpm = Math.round(totalWpm / stats.totalSessions);

  if (wpm > stats.bestWpm) stats.bestWpm = wpm;

  const totalAcc = stats.averageAccuracy * (stats.totalSessions - 1) + accuracy;
  stats.averageAccuracy = Math.round(totalAcc / stats.totalSessions);

  if (accuracy > stats.bestAccuracy) stats.bestAccuracy = accuracy;

  const today = new Date().toISOString().split("T")[0];
  if (!stats.dailyStats[today]) {
    stats.dailyStats[today] = { wpm: 0, accuracy: 0, sessions: 0 };
  }
  const daily = stats.dailyStats[today];
  const dailyWpm = daily.wpm * daily.sessions + wpm;
  daily.sessions++;
  daily.wpm = Math.round(dailyWpm / daily.sessions);
  const dailyAcc = daily.accuracy * (daily.sessions - 1) + accuracy;
  daily.accuracy = Math.round(dailyAcc / daily.sessions);

  if (!stats.recentSessions) stats.recentSessions = [];
  stats.recentSessions.unshift({ wpm, accuracy, timestamp: Date.now(), wordsTyped });
  if (stats.recentSessions.length > 20) stats.recentSessions = stats.recentSessions.slice(0, 20);

  saveStats(stats);
}

export function loadStreak(): { current: number; best: number; lastPracticed: string } {
  return loadFromStorage(STORAGE_STREAK, { current: 0, best: 0, lastPracticed: "" });
}

export function updateStreak(): { current: number; best: number } {
  const streak = loadStreak();
  const today = new Date().toLocaleDateString("en-CA");
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");

  if (streak.lastPracticed === today) {
    return { current: streak.current, best: streak.best };
  }

  let newCurrent = 1;
  if (streak.lastPracticed === yesterday) {
    newCurrent = streak.current + 1;
  }

  const newBest = Math.max(newCurrent, streak.best);
  const newStreak = { current: newCurrent, best: newBest, lastPracticed: today };

  saveToStorage(STORAGE_STREAK, newStreak);

  return { current: newCurrent, best: newBest };
}

export default function StatisticsDashboard({ theme, refreshKey }: StatisticsDashboardProps) {
  const [stats, setStats] = useState<StatsData>(loadStats);

  const refresh = useCallback(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  useEffect(() => {
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  const isDark = theme === "dark";
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return d.toISOString().split("T")[0];
  });

  const maxWpm = Math.max(...last7Days.map(d => stats.dailyStats[d]?.wpm || 0), 1);
  const maxAccuracy = Math.max(...last7Days.map(d => stats.dailyStats[d]?.accuracy || 0), 1);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const cardStyle: React.CSSProperties = {
    background: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "var(--radius-lg)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
    padding: 24,
  };

  return (
    <div style={{ animation: "slideUp 0.3s ease-out" }}>
      <div style={cardStyle}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChartIcon />
            Statistics Dashboard
          </div>
          <button
            onClick={refresh}
            style={{
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              background: "transparent",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <RefreshIcon />
            Refresh
          </button>
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={exportStatsJSON}
              style={{
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              JSON
            </button>
            <button
              onClick={exportStatsCSV}
              style={{
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              CSV
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Sessions", value: stats.totalSessions, color: "var(--primary)" },
            { label: "Words Typed", value: stats.totalWordsTyped.toLocaleString(), color: "var(--accent)" },
            { label: "Avg WPM", value: stats.averageWpm, color: "var(--success)" },
            { label: "Best WPM", value: stats.bestWpm, color: "var(--warning)" },
          ].map((stat) => (
            <div key={stat.label} style={{
              textAlign: "center",
              padding: "12px 8px",
              borderRadius: "var(--radius-md)",
              background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: isDark ? "var(--muted-dark)" : "var(--muted-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          <div style={{
            textAlign: "center",
            padding: "12px 8px",
            borderRadius: "var(--radius-md)",
            background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--success)" }}>{stats.averageAccuracy}%</div>
            <div style={{ fontSize: 10, color: isDark ? "var(--muted-dark)" : "var(--muted-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg Accuracy</div>
          </div>
          <div style={{
            textAlign: "center",
            padding: "12px 8px",
            borderRadius: "var(--radius-md)",
            background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>{stats.bestAccuracy}%</div>
            <div style={{ fontSize: 10, color: isDark ? "var(--muted-dark)" : "var(--muted-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Best Accuracy</div>
          </div>
          <div style={{
            textAlign: "center",
            padding: "12px 8px",
            borderRadius: "var(--radius-md)",
            background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)" }}>{formatTime(stats.totalTimeTyped)}</div>
            <div style={{ fontSize: 10, color: isDark ? "var(--muted-dark)" : "var(--muted-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Time</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>
              WPM (Last 7 Days)
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, marginBottom: 6 }}>
              {last7Days.map((day) => {
                const wpm = stats.dailyStats[day]?.wpm || 0;
                const height = maxWpm > 0 ? (wpm / maxWpm) * 100 : 0;
                return (
                  <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <div style={{ fontSize: 9, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>{wpm}</div>
                    <div style={{
                      width: "100%",
                      height: `${Math.max(height, 4)}%`,
                      background: "linear-gradient(180deg, var(--primary), var(--accent))",
                      borderRadius: 3,
                      transition: "height 0.5s ease",
                    }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {last7Days.map((day) => (
                <div key={day} style={{ flex: 1, textAlign: "center", fontSize: 8, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>
                  {new Date(day).toLocaleDateString("en", { weekday: "short" })}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>
              Accuracy (Last 7 Days)
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, marginBottom: 6 }}>
              {last7Days.map((day) => {
                const acc = stats.dailyStats[day]?.accuracy || 0;
                const height = maxAccuracy > 0 ? (acc / maxAccuracy) * 100 : 0;
                return (
                  <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <div style={{ fontSize: 9, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>{acc}%</div>
                    <div style={{
                      width: "100%",
                      height: `${Math.max(height, 4)}%`,
                      background: `linear-gradient(180deg, ${acc >= 90 ? "var(--success)" : acc >= 70 ? "var(--warning)" : "var(--error)"}, ${acc >= 90 ? "#16a34a" : acc >= 70 ? "#d97706" : "#dc2626"})`,
                      borderRadius: 3,
                      transition: "height 0.5s ease",
                    }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {last7Days.map((day) => (
                <div key={day} style={{ flex: 1, textAlign: "center", fontSize: 8, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>
                  {new Date(day).toLocaleDateString("en", { weekday: "short" })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {stats.recentSessions && stats.recentSessions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>
              Recent Activity
            </div>
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {stats.recentSessions.slice(0, 10).map((session, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: isDark ? "rgba(15, 23, 42, 0.3)" : "rgba(248, 250, 252, 0.5)",
                  marginBottom: 4,
                  fontSize: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontWeight: 600, color: "var(--primary)" }}>{session.wpm} WPM</span>
                    <span style={{ color: session.accuracy >= 90 ? "var(--success)" : session.accuracy >= 70 ? "var(--warning)" : "var(--error)" }}>{session.accuracy}%</span>
                    <span style={{ color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>{session.wordsTyped} words</span>
                  </div>
                  <span style={{ color: isDark ? "var(--muted-dark)" : "var(--muted-light)", fontSize: 10 }}>
                    {new Date(session.timestamp).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
