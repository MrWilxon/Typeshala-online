"use client";

import { useState, useEffect, useCallback } from "react";
import { STORAGE_STATS, STORAGE_ACHIEVEMENTS } from "@/lib/storageKeys";
import { loadFromStorage, saveToStorage } from "@/lib/storage";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: { totalSessions: number; totalWordsTyped: number; bestWpm: number; bestAccuracy: number }) => boolean;
}

interface AchievementsProps {
  theme: "light" | "dark";
  refreshKey?: number;
}

function loadStats() {
  return loadFromStorage(STORAGE_STATS, {
    totalSessions: 0,
    totalWordsTyped: 0,
    averageWpm: 0,
    bestWpm: 0,
    averageAccuracy: 0,
    bestAccuracy: 0,
    totalTimeTyped: 0,
    dailyStats: {},
    recentSessions: [],
  });
}

function loadUnlockedAchievements(): string[] {
  return loadFromStorage<string[]>(STORAGE_ACHIEVEMENTS, []);
}

function saveUnlockedAchievements(ids: string[]) {
  saveToStorage(STORAGE_ACHIEVEMENTS, ids);
}

const achievements: Achievement[] = [
  { id: "first_steps", name: "First Steps", description: "Complete your first typing session", icon: "1️⃣", condition: (s) => s.totalSessions >= 1 },
  { id: "getting_started", name: "Getting Started", description: "Complete 10 typing sessions", icon: "🔟", condition: (s) => s.totalSessions >= 10 },
  { id: "dedicated", name: "Dedicated", description: "Complete 50 typing sessions", icon: "🏆", condition: (s) => s.totalSessions >= 50 },
  { id: "typing_master", name: "Typing Master", description: "Complete 100 typing sessions", icon: "👑", condition: (s) => s.totalSessions >= 100 },
  { id: "speed_demon", name: "Speed Demon", description: "Reach 30 WPM", icon: "⚡", condition: (s) => s.bestWpm >= 30 },
  { id: "lightning_fingers", name: "Lightning Fingers", description: "Reach 50 WPM", icon: "🌩️", condition: (s) => s.bestWpm >= 50 },
  { id: "typing_legend", name: "Typing Legend", description: "Reach 80 WPM", icon: "🌟", condition: (s) => s.bestWpm >= 80 },
  { id: "perfectionist", name: "Perfectionist", description: "Achieve 100% accuracy", icon: "🎯", condition: (s) => s.bestAccuracy >= 100 },
  { id: "consistent", name: "Consistent", description: "Achieve 90% average accuracy", icon: "✅", condition: (s) => s.bestAccuracy >= 90 },
  { id: "wordsmith", name: "Wordsmith", description: "Type 1,000 words total", icon: "📝", condition: (s) => s.totalWordsTyped >= 1000 },
  { id: "novelist", name: "Novelist", description: "Type 10,000 words total", icon: "📚", condition: (s) => s.totalWordsTyped >= 10000 },
  { id: "marathon", name: "Marathon", description: "Type 100,000 words total", icon: "🏃", condition: (s) => s.totalWordsTyped >= 100000 },
];

export function checkAchievements(): { unlocked: string[]; newlyUnlocked: Achievement[] } {
  const stats = loadStats();
  const unlockedIds = loadUnlockedAchievements();
  const unlockedSet = new Set(unlockedIds);
  const newlyUnlocked: Achievement[] = [];

  achievements.forEach((a) => {
    if (!unlockedSet.has(a.id) && a.condition(stats)) {
      unlockedSet.add(a.id);
      newlyUnlocked.push(a);
    }
  });

  if (newlyUnlocked.length > 0) {
    saveUnlockedAchievements(Array.from(unlockedSet));
  }

  return { unlocked: Array.from(unlockedSet), newlyUnlocked };
}

export default function Achievements({ theme, refreshKey }: AchievementsProps) {
  const [unlocked, setUnlocked] = useState<string[]>([]);

  const refresh = useCallback(() => {
    const { unlocked: ids } = checkAchievements();
    setUnlocked(ids);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  const isDark = theme === "dark";
  const stats = loadStats();

  return (
    <div style={{
      background: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(20px)",
      borderRadius: "var(--radius-lg)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      padding: 24,
      marginBottom: 16,
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
          Achievements ({unlocked.length}/{achievements.length})
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
          Refresh
        </button>
      </div>

      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 16,
        padding: 12,
        borderRadius: "var(--radius-md)",
        background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>{unlocked.length}</div>
          <div style={{ fontSize: 10, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>Unlocked</div>
        </div>
        <div style={{ width: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>{achievements.length - unlocked.length}</div>
          <div style={{ fontSize: 10, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>Remaining</div>
        </div>
        <div style={{ width: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--warning)" }}>{Math.round((unlocked.length / achievements.length) * 100)}%</div>
          <div style={{ fontSize: 10, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>Complete</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {achievements.map((a) => {
          const isUnlocked = unlocked.includes(a.id);
          return (
            <div key={a.id} style={{
              padding: 14,
              borderRadius: "var(--radius-md)",
              background: isUnlocked
                ? isDark ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.1)"
                : isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
              border: `1px solid ${isUnlocked ? "rgba(99,102,241,0.3)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              opacity: isUnlocked ? 1 : 0.5,
              textAlign: "center",
              transition: "all 0.3s ease",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{a.name}</div>
              <div style={{ fontSize: 10, color: isDark ? "var(--muted-dark)" : "var(--muted-light)", lineHeight: 1.4 }}>{a.description}</div>
              {isUnlocked && (
                <div style={{
                  fontSize: 9,
                  color: "var(--success)",
                  marginTop: 8,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Unlocked
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
