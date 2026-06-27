"use client";

import { SettingsIcon, TrophyIcon, MoonIcon, SunIcon, VolumeIcon, VolumeXIcon, PauseIcon, PlayIcon, RotateCcwIcon, TypeIcon, BookIcon, BarChartIcon, HandIcon, DownloadIcon } from "./Icons";

export type Theme = "light" | "dark";
export type PracticeMode = "lessons" | "custom" | "test";

interface HeaderProps {
  theme: Theme;
  practiceMode: PracticeMode;
  streak: { current: number; best: number };
  isPaused: boolean;
  showFingerGuide: boolean;
  showStats: boolean;
  showAchievements: boolean;
  showScores: boolean;
  soundEnabled: boolean;
  keyboardType: string;
  setType: string;
  setPracticeMode: (mode: PracticeMode) => void;
  setKeyboardType: (type: string) => void;
  setSetType: (type: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleTheme: () => void;
  handlePause: () => void;
  handleRestart: () => void;
  setShowFingerGuide: (show: boolean) => void;
  setShowStats: (show: boolean) => void;
  setShowAchievements: (show: boolean) => void;
  setShowScores: (show: boolean) => void;
}

export function Header({
  theme,
  practiceMode,
  streak,
  isPaused,
  showFingerGuide,
  showStats,
  showAchievements,
  showScores,
  soundEnabled,
  keyboardType,
  setType,
  setPracticeMode,
  setKeyboardType,
  setSetType,
  setSoundEnabled,
  toggleTheme,
  handlePause,
  handleRestart,
  setShowFingerGuide,
  setShowStats,
  setShowAchievements,
  setShowScores,
}: HeaderProps) {
  const isDark = theme === "dark";

  const glassStyle: React.CSSProperties = {
    background: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
  };

  const controlStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: "var(--radius-sm)",
    background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
    transition: "border-color var(--transition)",
  };

  const selectStyle: React.CSSProperties = {
    background: "transparent",
    color: isDark ? "#f1f5f9" : "#0f172a",
    border: "none",
    padding: "4px 0",
    fontSize: 12,
    fontWeight: 500,
    outline: "none",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    appearance: "none",
  };

  const btnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    color: isDark ? "#f1f5f9" : "#0f172a",
    padding: "6px 12px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
    transition: "all var(--transition)",
    whiteSpace: "nowrap",
  };

  return (
    <header style={{ ...glassStyle, position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--primary), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white", fontFamily: "var(--font-nepali)" }}>ट</div>
          <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.02em" }}>Typeshala</span>
          {streak.current > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 12, background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.2)", fontSize: 11, fontWeight: 600, color: "#f97316" }}>
              🔥 {streak.current} day streak
            </div>
          )}
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <button onClick={() => setPracticeMode("lessons")} style={{ ...btnStyle, background: practiceMode === "lessons" ? "linear-gradient(135deg, var(--primary), var(--accent))" : isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)", color: practiceMode === "lessons" ? "white" : isDark ? "#f1f5f9" : "#0f172a", borderColor: practiceMode === "lessons" ? "transparent" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}><BookIcon /> Lessons</button>
          <button onClick={() => setPracticeMode("custom")} style={{ ...btnStyle, background: practiceMode === "custom" ? "linear-gradient(135deg, var(--primary), var(--accent))" : isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)", color: practiceMode === "custom" ? "white" : isDark ? "#f1f5f9" : "#0f172a", borderColor: practiceMode === "custom" ? "transparent" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}><TypeIcon /> Custom</button>
          <button onClick={() => setPracticeMode("test")} style={{ ...btnStyle, background: practiceMode === "test" ? "linear-gradient(135deg, var(--primary), var(--accent))" : isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)", color: practiceMode === "test" ? "white" : isDark ? "#f1f5f9" : "#0f172a", borderColor: practiceMode === "test" ? "transparent" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Test
          </button>
          <div style={{ width: 1, height: 24, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
          {practiceMode !== "test" && (
            <>
              <div style={{
                display: "flex",
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                overflow: "hidden",
              }}>
                <button
                  onClick={() => setKeyboardType("traditional")}
                  style={{
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "var(--font-nepali)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    background: keyboardType === "traditional"
                      ? "linear-gradient(135deg, var(--primary), var(--accent))"
                      : "transparent",
                    color: keyboardType === "traditional"
                      ? "white"
                      : isDark ? "var(--muted-dark)" : "var(--muted-light)",
                  }}
                >
                  नेपाली
                </button>
                <button
                  onClick={() => setKeyboardType("english")}
                  style={{
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "var(--font-sans)",
                    border: "none",
                    borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    background: keyboardType === "english"
                      ? "linear-gradient(135deg, var(--primary), var(--accent))"
                      : "transparent",
                    color: keyboardType === "english"
                      ? "white"
                      : isDark ? "var(--muted-dark)" : "var(--muted-light)",
                  }}
                >
                  English
                </button>
              </div>
              <div style={controlStyle}>
                <select value={setType} onChange={(e) => setSetType(e.target.value)} style={selectStyle}>
                  <option value="numRow">Numbers</option>
                  <option value="topRow">Top Row</option>
                  <option value="midRow">Home Row</option>
                  <option value="lowRow">Bottom Row</option>
                  <option value="allKeys">All Keys</option>
                </select>
              </div>
            </>
          )}
          <div style={{ width: 1, height: 24, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
          {practiceMode !== "test" && (
            <>
              <button onClick={handlePause} style={btnStyle} title={isPaused ? "Resume" : "Pause"}>
                {isPaused ? <PlayIcon /> : <PauseIcon />}
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button onClick={handleRestart} style={btnStyle} title="Restart"><RotateCcwIcon /> Restart</button>
              <button onClick={() => setShowFingerGuide(!showFingerGuide)} style={{ ...btnStyle, background: showFingerGuide ? isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)" : isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)", color: showFingerGuide ? "var(--success)" : isDark ? "#f1f5f9" : "#0f172a", borderColor: showFingerGuide ? "rgba(34,197,94,0.2)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} title="Finger Guide"><HandIcon /></button>
            </>
          )}
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ ...btnStyle, background: soundEnabled ? isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)" : isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)", color: soundEnabled ? "var(--success)" : "var(--error)", borderColor: soundEnabled ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)" }} title="Toggle sound">
            {soundEnabled ? <VolumeIcon /> : <VolumeXIcon />}
          </button>
          <button onClick={toggleTheme} style={btnStyle} title="Toggle theme">{isDark ? <SunIcon /> : <MoonIcon />}</button>
          <a href="https://wilson.com.np/free-download-nepali-and-english-typeshala-for-windows-pc/" target="_blank" rel="noopener noreferrer" style={{ ...btnStyle, background: "linear-gradient(135deg, var(--primary), var(--accent))", color: "white", borderColor: "transparent", textDecoration: "none" }}><DownloadIcon /> Download</a>
          <button onClick={() => { setShowStats(!showStats); setShowAchievements(false); setShowScores(false); }} style={{ ...btnStyle, color: showStats ? "var(--primary)" : isDark ? "var(--accent)" : "var(--accent-dark)", borderColor: showStats ? "rgba(99,102,241,0.2)" : isDark ? "rgba(6,182,212,0.2)" : "rgba(8,145,178,0.2)" }} title="Statistics"><BarChartIcon /></button>
          <button onClick={() => { setShowAchievements(!showAchievements); setShowStats(false); setShowScores(false); }} style={{ ...btnStyle, color: showAchievements ? "var(--primary)" : isDark ? "var(--warning)" : "var(--primary)", borderColor: showAchievements ? "rgba(99,102,241,0.2)" : isDark ? "rgba(251,191,36,0.2)" : "rgba(99,102,241,0.2)" }} title="Achievements">🏆</button>
          <button onClick={() => { setShowScores(!showScores); setShowStats(false); setShowAchievements(false); }} style={{ ...btnStyle, color: showScores ? "var(--primary)" : isDark ? "var(--accent)" : "var(--accent-dark)", borderColor: showScores ? "rgba(99,102,241,0.2)" : isDark ? "rgba(6,182,212,0.2)" : "rgba(8,145,178,0.2)" }} title="High scores"><TrophyIcon /></button>
        </nav>
      </div>
    </header>
  );
}
