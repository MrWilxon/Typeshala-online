"use client";

import { lessons } from "@/data/lessons";
import type { SetType } from "@/data/keyboardLayouts";

interface LessonSelectorProps {
  keyboardType: string;
  setType: SetType;
  currentIndex: number;
  completedLessons: string[];
  onSelect: (index: number) => void;
  theme: "light" | "dark";
  currentNote?: string;
}

function getDifficultyLabel(difficulty: number): string {
  if (difficulty <= 1) return "Easy";
  if (difficulty <= 2) return "Medium";
  if (difficulty <= 3) return "Hard";
  if (difficulty <= 4) return "Expert";
  return "Master";
}

function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 1) return "#22c55e";
  if (difficulty <= 2) return "#f97316";
  if (difficulty <= 3) return "#ef4444";
  if (difficulty <= 4) return "#8b5cf6";
  return "#ec4899";
}

export default function LessonSelector({
  keyboardType,
  setType,
  currentIndex,
  completedLessons,
  onSelect,
  theme,
  currentNote,
}: LessonSelectorProps) {
  const isDark = theme === "dark";
  const language = keyboardType === "traditional" ? "ne" : "en";
  const progressKey = `${language}_${setType}`;

  const filteredLessons = Object.entries(lessons)
    .filter(([_, lesson]) => lesson.setType === setType && lesson.language === language)
    .map(([key, lesson]) => ({
      key,
      ...lesson,
    }));

  return (
    <div style={{
      background: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(20px)",
      borderRadius: "var(--radius-lg)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      padding: 16,
      marginBottom: 24,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        Select Lesson ({filteredLessons.length} available)
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {filteredLessons.map((lesson, idx) => {
          const lessonKey = `${progressKey}_${idx}`;
          const isCompleted = completedLessons.includes(lessonKey);
          const isCurrent = idx === currentIndex;
          const difficultyColor = getDifficultyColor(lesson.difficulty);
          const difficultyLabel = getDifficultyLabel(lesson.difficulty);

          return (
            <button
              key={lesson.key}
              onClick={() => onSelect(idx)}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                background: isCurrent
                  ? "linear-gradient(135deg, var(--primary), var(--accent))"
                  : isCompleted
                    ? isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)"
                    : isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
                color: isCurrent
                  ? "white"
                  : isCompleted
                    ? "var(--success)"
                    : isDark ? "#f1f5f9" : "#0f172a",
                border: `1px solid ${isCurrent ? "transparent" : isCompleted ? "rgba(34,197,94,0.2)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 500,
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                minWidth: 70,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {isCompleted && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                <span>Lesson {idx + 1}</span>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: 8,
                opacity: 0.8,
              }}>
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: difficultyColor,
                }} />
                <span style={{ color: isCurrent ? "rgba(255,255,255,0.8)" : difficultyColor }}>
                  {difficultyLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Easy", color: "#22c55e" },
          { label: "Medium", color: "#f97316" },
          { label: "Hard", color: "#ef4444" },
          { label: "Expert", color: "#8b5cf6" },
          { label: "Master", color: "#ec4899" },
        ].map((d) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.color }} />
            <span style={{ color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>{d.label}</span>
          </div>
        ))}
      </div>

      {currentNote && (
        <div style={{
          marginTop: 12,
          padding: "10px 14px",
          borderRadius: "var(--radius-sm)",
          background: isDark ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.05)",
          border: `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)"}`,
          fontSize: 12,
          color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
          lineHeight: 1.5,
        }}>
          <strong style={{ color: "var(--primary)" }}>Tip:</strong> {currentNote}
        </div>
      )}
    </div>
  );
}
