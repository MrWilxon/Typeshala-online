"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import TypingArea from "./TypingArea";
import Keyboard from "./Keyboard";
import StatsBar from "./StatsBar";
import FingerGuide from "./FingerGuide";
import StatisticsDashboard, { recordSession, updateStreak, loadStreak } from "./StatisticsDashboard";
import Achievements, { checkAchievements } from "./Achievements";
import TypingTest from "./TypingTest";
import LessonSelector from "./LessonSelector";
import { Header } from "./Header";
import { HighScores } from "./HighScores";
import { ToastNotifications } from "./ToastNotifications";
import { TimerIcon, TrophyIcon, MoonIcon, SunIcon, VolumeIcon, VolumeXIcon, PauseIcon, PlayIcon, RotateCcwIcon, TypeIcon, BookIcon, BarChartIcon, HandIcon } from "./Icons";
import { getLessonsByType, lessons } from "@/data/lessons";
import type { SetType } from "@/data/keyboardLayouts";
import { saveScore, getScores } from "@/lib/api";
import type { ScorePayload } from "@/lib/api";
import { STORAGE_PROGRESS, STORAGE_THEME, STORAGE_LOCAL_SCORES } from "@/lib/storageKeys";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { playKeySound, playErrorSound, playCompleteSound, resumeAudioContext } from "@/lib/audio";

type Theme = "light" | "dark";
type PracticeMode = "lessons" | "custom" | "test";

interface ProgressData {
  currentLesson: number;
  completedLessons: string[];
}

function loadProgress(): ProgressData | null {
  return loadFromStorage<ProgressData | null>(STORAGE_PROGRESS, null);
}

function saveProgress(data: ProgressData) {
  saveToStorage(STORAGE_PROGRESS, data);
}

function loadTheme(): Theme {
  const saved = loadFromStorage<Theme | null>(STORAGE_THEME, null);
  if (saved === "dark" || saved === "light") return saved;
  return "light";
}

function saveTheme(theme: Theme) {
  saveToStorage(STORAGE_THEME, theme);
}

interface LocalScore {
  wpm: number;
  accuracy: number;
  lesson: string;
  setType: string;
  timestamp: number;
}

function loadLocalScores(): LocalScore[] {
  return loadFromStorage<LocalScore[]>(STORAGE_LOCAL_SCORES, []);
}

function saveLocalScore(score: LocalScore) {
  const scores = loadLocalScores();
  scores.unshift(score);
  if (scores.length > 50) scores.splice(50);
  saveToStorage(STORAGE_LOCAL_SCORES, scores);
}

interface HighScore {
  wpm: number;
  accuracy: number;
  lesson: string;
  setType: string;
}

export default function TypingTutor({ initialKeyboardType = "traditional" }: { initialKeyboardType?: string }) {
  const [keyboardType, setKeyboardType] = useState<string>(initialKeyboardType);
  const [setType, setSetType] = useState<SetType>("midRow");
  const [lessonStrings, setLessonStrings] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedString, setTypedString] = useState("");
  const [activeKey, setActiveKey] = useState<number>(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [showScores, setShowScores] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [practiceMode, setPracticeMode] = useState<PracticeMode>("lessons");
  const [customText, setCustomText] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showFingerGuide, setShowFingerGuide] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [streak, setStreak] = useState({ current: 0, best: 0 });
  const [refreshKey, setRefreshKey] = useState(0);
  const [toasts, setToasts] = useState<Array<{ id: number; achievement: { name: string; icon: string; description: string } }>>([]);

  const toastIdRef = useRef(0);

  const showToast = useCallback((achievement: { name: string; icon: string; description: string }) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, achievement }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typedLenRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const lessonStringsRef = useRef<string[]>([]);
  const shiftHeldRef = useRef(false);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lessonPrefix = keyboardType === "traditional" ? "ne" : "en";

  const currentString = practiceMode === "custom" && customText
    ? customText
    : lessonStrings[currentIndex] || "";
  const progressKey = `${lessonPrefix}_${setType}`;

  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.completedLessons) {
      setCompletedLessons(saved.completedLessons);
    }
    setStreak(loadStreak());
  }, []);

  useEffect(() => {
    if (practiceMode === "lessons") {
      const lessons = getLessonsByType(setType, keyboardType === "traditional" ? "ne" : "en");
      setLessonStrings(lessons);
      setCurrentIndex(0);
      currentIndexRef.current = 0;
      lessonStringsRef.current = lessons;
      setTypedString("");
      startTimeRef.current = null;
      setWpm(0);
      setAccuracy(0);
      setElapsed(0);
      setShowComplete(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current);
    }
  }, [setType, keyboardType, practiceMode]);

  useEffect(() => {
    const controller = new AbortController();
    getScores(controller.signal)
      .then((data) => {
        if (Array.isArray(data)) setHighScores(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const mergedScores = useMemo(() => {
    const local = loadLocalScores().map(s => ({ ...s, source: "local" as const }));
    const backend = highScores.map(s => ({ ...s, source: "backend" as const, timestamp: 0 }));
    const all = [...local, ...backend];
    all.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
    return all.slice(0, 20);
  }, [highScores]);

  const calculateStats = useCallback((typed: string, target: string) => {
    if (typed.length === 0) {
      setAccuracy(0);
      setWpm(0);
      return;
    }

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (i < target.length && typed[i] === target[i]) correct++;
    }
    const acc = Math.floor((100 * correct) / typed.length);
    setAccuracy(acc);
  }, []);

  const saveBestLocally = useCallback((wpm: number, acc: number) => {
    const key = `${progressKey}_${currentIndex}`;
    const existing = loadProgress();
    const completed = existing?.completedLessons || [];
    if (!completed.includes(key)) {
      completed.push(key);
    }
    const bestRaw = localStorage.getItem(`${STORAGE_PROGRESS}_best`);
    const bestScores: Record<string, { wpm: number; accuracy: number }> = bestRaw ? JSON.parse(bestRaw) : {};
    const prev = bestScores[key];
    if (!prev || wpm > prev.wpm || (wpm === prev.wpm && acc > prev.accuracy)) {
      bestScores[key] = { wpm, accuracy };
      localStorage.setItem(`${STORAGE_PROGRESS}_best`, JSON.stringify(bestScores));
    }
    saveProgress({ currentLesson: currentIndex, completedLessons: completed });
    setCompletedLessons(completed);
  }, [progressKey, currentIndex]);

  const handleSubmitScore = useCallback(async () => {
    if (wpm > 0) {
      saveBestLocally(wpm, accuracy);

      const wordsTyped = Math.floor(typedString.length / 5);
      recordSession(wpm, accuracy, wordsTyped, elapsed);
      const newStreak = updateStreak();
      setStreak(newStreak);
      setRefreshKey((k) => k + 1);

      const localScore: LocalScore = {
        wpm,
        accuracy,
        lesson: currentString.slice(0, 50),
        setType,
        timestamp: Date.now(),
      };
      saveLocalScore(localScore);

      const payload: ScorePayload = {
        wpm,
        accuracy,
        lesson: currentString.slice(0, 50),
        setType,
      };
      try {
        await saveScore(payload);
        const data = await getScores();
        if (Array.isArray(data)) setHighScores(data);
      } catch { /* backend might be down */ }

      const { newlyUnlocked } = checkAchievements();
      newlyUnlocked.forEach(a => showToast({ name: a.name, icon: a.icon, description: a.description }));
    }
  }, [wpm, accuracy, typedString, currentString, setType, saveBestLocally, elapsed, showToast]);

  useEffect(() => {
    typedLenRef.current = typedString.length;
  }, [typedString]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    lessonStringsRef.current = lessonStrings;
  }, [lessonStrings]);

  useEffect(() => {
    if (practiceMode === "test" || isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyCode = e.which || e.keyCode;

      if (keyCode === 16) {
        shiftHeldRef.current = true;
      }

      if (keyCode >= 37 && keyCode <= 40) {
        e.preventDefault();
        return;
      }

      if (keyCode === 9) {
        e.preventDefault();
        return;
      }

      resumeAudioContext();

      setActiveKey(keyCode);

      if (keyCode === 8) {
        e.preventDefault();
        setTypedString((prev) => {
          const next = prev.slice(0, -1);
          calculateStats(next, currentString);
          return next;
        });
        return;
      }

      if (keyCode === 13 || keyCode >= 33 && keyCode <= 47 || keyCode >= 58 && keyCode <= 64 ||
          keyCode >= 91 && keyCode <= 96 || keyCode >= 123 && keyCode <= 126 ||
          keyCode >= 186 && keyCode <= 192 || keyCode >= 219 && keyCode <= 222 ||
          (keyCode >= 48 && keyCode <= 90) || keyCode === 32) {
        if (!startTimeRef.current) {
          const now = Date.now();
          startTimeRef.current = now;
          timerRef.current = setInterval(() => {
            setElapsed((Date.now() - now) / 1000);
          }, 200);
        }
        const char = e.key;
        const prevLen = typedLenRef.current;
        const targetStr = currentString;

        if (soundEnabled) {
          const isCorrect = prevLen < targetStr.length &&
            char === targetStr[prevLen];
          if (isCorrect) {
            playKeySound();
          } else if (prevLen < targetStr.length) {
            playErrorSound();
          } else {
            playKeySound();
          }
        }

        setTypedString((prev) => {
          const next = prev + char;
          const sTime = startTimeRef.current;
          if (sTime) {
            const elapsedMinutes = (Date.now() - sTime) / 1000 / 60;
            if (elapsedMinutes > 0) {
              const words = next.length / 5;
              setWpm(Math.round(words / elapsedMinutes));
            }
          }

          calculateStats(next, targetStr);

          if (next.length >= targetStr.length) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (soundEnabled) playCompleteSound();
            setShowComplete(true);
            completionTimeoutRef.current = setTimeout(() => {
              handleSubmitScore();
              if (practiceMode === "lessons") {
                const nextIdx = (currentIndexRef.current + 1) % lessonStringsRef.current.length;
                currentIndexRef.current = nextIdx;
                setCurrentIndex(nextIdx);
              } else if (practiceMode === "custom") {
                setTypedString("");
                startTimeRef.current = null;
                setShowComplete(false);
                return;
              }
              setTypedString("");
              startTimeRef.current = null;
              setWpm(0);
              setAccuracy(0);
              setElapsed(0);
              setShowComplete(false);
            }, 1500);
          }

          return next;
        });

        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyCode = e.which || e.keyCode;
      if (keyCode === 16) {
        shiftHeldRef.current = false;
      }
      if (shiftHeldRef.current && keyCode !== 16) {
        return;
      }
      setActiveKey(0);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      if (timerRef.current) clearInterval(timerRef.current);
      if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current);
    };
  }, [currentString, calculateStats, handleSubmitScore, soundEnabled, practiceMode, isPaused]);

  const handleKeyClick = useCallback((char: string, keyCode: number) => {
    if (practiceMode === "test" || isPaused) return;
    if (!char && keyCode !== 8 && keyCode !== 13) return;
    if (keyCode === 8) {
      setTypedString((prev) => {
        const next = prev.slice(0, -1);
        calculateStats(next, currentString);
        return next;
      });
      return;
    }
    if (!startTimeRef.current) {
      const now = Date.now();
      startTimeRef.current = now;
      timerRef.current = setInterval(() => {
        setElapsed((Date.now() - now) / 1000);
      }, 200);
    }
    if (char) {
      setActiveKey(keyCode);
      const targetStr = currentString;
      setTypedString((prev) => {
        const next = prev + char;
        const sTime = startTimeRef.current;
        if (sTime) {
          const elapsedMinutes = (Date.now() - sTime) / 1000 / 60;
          if (elapsedMinutes > 0) {
            const words = next.length / 5;
            setWpm(Math.round(words / elapsedMinutes));
          }
        }
        calculateStats(next, targetStr);
        if (next.length >= targetStr.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (soundEnabled) playCompleteSound();
          setShowComplete(true);
          completionTimeoutRef.current = setTimeout(() => {
            handleSubmitScore();
            if (practiceMode === "lessons") {
              const nextIdx = (currentIndexRef.current + 1) % lessonStringsRef.current.length;
              currentIndexRef.current = nextIdx;
              setCurrentIndex(nextIdx);
            } else if (practiceMode === "custom") {
              setTypedString("");
              startTimeRef.current = null;
              setShowComplete(false);
              return;
            }
            setTypedString("");
            startTimeRef.current = null;
            setWpm(0);
            setAccuracy(0);
            setElapsed(0);
            setShowComplete(false);
          }, 1500);
        }
        return next;
      });
      if (soundEnabled) playKeySound();
    }
  }, [currentString, calculateStats, handleSubmitScore, soundEnabled, practiceMode, isPaused]);

  const handlePause = useCallback(() => {
    setIsPaused((p) => !p);
  }, []);

  const handleRestart = useCallback(() => {
    setTypedString("");
    startTimeRef.current = null;
    setWpm(0);
    setAccuracy(0);
    setElapsed(0);
    setShowComplete(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current);
  }, []);

  const handleLessonChange = useCallback((index: number) => {
    setCurrentIndex(index);
    currentIndexRef.current = index;
    handleRestart();
  }, [handleRestart]);

  const handleCustomTextChange = useCallback((text: string) => {
    setCustomText(text);
    handleRestart();
  }, [handleRestart]);

  function toggleTheme() {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      saveTheme(next);
      return next;
    });
  }

  const isDark = theme === "dark";

  const pageStyle: React.CSSProperties = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: isDark ? "#0f172a" : "#f8fafc",
    color: isDark ? "#f1f5f9" : "#0f172a",
    transition: "background-color 0.3s, color 0.3s",
    backgroundImage: isDark
      ? "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.06) 0%, transparent 60%)"
      : "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.03) 0%, transparent 60%)",
  };

  const glassStyle: React.CSSProperties = {
    background: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
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

  const completedCount = completedLessons.filter(l => l.startsWith(progressKey)).length;

  const currentLessonNote = (() => {
    const lessonKeys = Object.keys(lessons).filter(
      key => lessons[key].setType === setType && lessons[key].language === (keyboardType === "traditional" ? "ne" : "en")
    );
    const currentKey = lessonKeys[currentIndex];
    return currentKey ? lessons[currentKey]?.note : undefined;
  })();

  const tabBtn = (mode: PracticeMode, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setPracticeMode(mode)}
      style={{
        padding: "4px 10px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "var(--font-sans)",
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: practiceMode === mode
          ? "linear-gradient(135deg, var(--primary), var(--accent))"
          : "transparent",
        color: practiceMode === mode ? "white" : isDark ? "var(--muted-dark)" : "var(--muted-light)",
        transition: "all 0.15s ease",
      }}
    >
      {icon}{label}
    </button>
  );

  const iconBtn = (onClick: () => void, icon: React.ReactNode, title: string, active?: boolean, activeColor?: string) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30,
        height: 30,
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? (activeColor || "rgba(99,102,241,0.12)") : "transparent",
        color: active ? (activeColor ? "inherit" : "var(--primary)") : isDark ? "var(--muted-dark)" : "var(--muted-light)",
        transition: "all 0.15s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {icon}
    </button>
  );

  const selectCompact = (id: string, value: string, onChange: (v: string) => void, options: { value: string; label: string }[]) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 8px",
      borderRadius: "var(--radius-sm)",
      background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
    }}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "transparent",
          color: isDark ? "#f1f5f9" : "#0f172a",
          border: "none",
          padding: "2px 0",
          fontSize: 11,
          fontWeight: 500,
          outline: "none",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#f1f5f9" : "#0f172a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none", flexShrink: 0 }}>
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );

  return (
    <div style={pageStyle}>
      {/* Tier 1: Primary navigation */}
      <header style={{
        ...glassStyle,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 12px",
          height: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              fontFamily: "var(--font-nepali)",
            }}>ट</div>
            <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: "-0.02em" }}>Typeshala</span>
            {streak.current > 0 && (
              <span style={{
                padding: "1px 6px",
                borderRadius: 8,
                background: "rgba(249,115,22,0.1)",
                fontSize: 10,
                fontWeight: 600,
                color: "#f97316",
              }}>🔥{streak.current}</span>
            )}
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 18, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", flexShrink: 0 }} />

          {/* Mode tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
            {tabBtn("lessons", "Lessons", <BookIcon />)}
            {tabBtn("custom", "Custom", <TypeIcon />)}
            {tabBtn("test", "Test", <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>)}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Utility icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
            {iconBtn(() => setSoundEnabled(s => !s), soundEnabled ? <VolumeIcon /> : <VolumeXIcon />, "Sound", soundEnabled, isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)")}
            {iconBtn(toggleTheme, isDark ? <SunIcon /> : <MoonIcon />, "Theme")}
            {iconBtn(() => { setShowStats(s => !s); setShowAchievements(false); setShowScores(false); }, <BarChartIcon />, "Stats", showStats)}
            {iconBtn(() => { setShowAchievements(s => !s); setShowStats(false); setShowScores(false); }, <span style={{ fontSize: 13 }}>🏆</span>, "Achievements", showAchievements)}
            {iconBtn(() => { setShowScores(s => !s); setShowStats(false); setShowAchievements(false); }, <TrophyIcon />, "Scores", showScores)}
          </div>
        </div>

        {/* Tier 2: Settings toolbar (only for lessons/custom mode) */}
        {practiceMode !== "test" && (
          <div style={{
            padding: "0 12px",
            height: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
          }}>
            {/* Language Toggle Switch */}
            <div style={{
              display: "flex",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              overflow: "hidden",
            }}>
              <button
                onClick={() => {
                  setKeyboardType("traditional");
                  setTypedString("");
                  startTimeRef.current = null;
                  setWpm(0);
                  setAccuracy(0);
                  setElapsed(0);
                  setShowComplete(false);
                }}
                style={{
                  padding: "2px 10px",
                  fontSize: 11,
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
                onClick={() => {
                  setKeyboardType("english");
                  setTypedString("");
                  startTimeRef.current = null;
                  setWpm(0);
                  setAccuracy(0);
                  setElapsed(0);
                  setShowComplete(false);
                }}
                style={{
                  padding: "2px 10px",
                  fontSize: 11,
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
            <div style={{ width: 1, height: 14, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
            {selectCompact("practice-range", setType, (v) => setSetType(v as SetType), [
              { value: "numRow", label: "Numbers" },
              { value: "topRow", label: "Top Row" },
              { value: "midRow", label: "Home Row" },
              { value: "lowRow", label: "Bottom Row" },
              { value: "allKeys", label: "All Keys" },
            ])}
            <div style={{ flex: 1 }} />
            {iconBtn(handlePause, isPaused ? <PlayIcon /> : <PauseIcon />, isPaused ? "Resume" : "Pause")}
            {iconBtn(handleRestart, <RotateCcwIcon />, "Restart")}
            {iconBtn(() => setShowFingerGuide(s => !s), <HandIcon />, "Finger Guide", showFingerGuide, isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)")}
            {isPaused && <span style={{ fontSize: 10, fontWeight: 600, color: "var(--warning)" }}>⏸ Paused</span>}
          </div>
        )}
      </header>

      <div className="accent-line" />

      <main style={{
        maxWidth: "100%",
        margin: "0 auto",
        padding: "12px 12px 24px",
        overflowY: "auto",
        flex: 1,
      }}>
        {practiceMode === "test" ? (
          <TypingTest keyboardType={keyboardType} theme={theme} onComplete={() => setStreak(loadStreak())} />
        ) : (
          <>
            <StatsBar wpm={wpm} accuracy={accuracy} elapsed={elapsed} theme={theme} />

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 12,
              color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
              marginBottom: 12,
            }}>
              {practiceMode === "lessons" && (
                <>
                  <span>Lesson {currentIndex + 1} of {lessonStrings.length}</span>
                  <span style={{ opacity: 0.3 }}>•</span>
                  <span>{completedCount}/{lessonStrings.length} completed</span>
                </>
              )}
              {practiceMode === "custom" && (
                <span>Custom text mode • {typedString.length}/{customText.length} chars</span>
              )}
              {isPaused && (
                <span style={{ color: "var(--warning)", fontWeight: 600 }}>⏸ Paused</span>
              )}
            </div>

            {practiceMode === "lessons" && (
              <LessonSelector
                keyboardType={keyboardType}
                setType={setType}
                currentIndex={currentIndex}
                completedLessons={completedLessons}
                onSelect={handleLessonChange}
                theme={theme}
                currentNote={currentLessonNote}
              />
            )}

            {practiceMode === "custom" && (
              <div style={{
                background: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                borderRadius: "var(--radius-lg)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                padding: 16,
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Enter custom text to practice:</div>
                <textarea
                  value={customText}
                  onChange={(e) => handleCustomTextChange(e.target.value)}
                  placeholder="Type or paste your text here..."
                  style={{
                    width: "100%",
                    minHeight: 80,
                    padding: 12,
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
                    color: isDark ? "#f1f5f9" : "#0f172a",
                    fontFamily: keyboardType === "traditional" ? "var(--font-nepali)" : "var(--font-sans)",
                    fontSize: 14,
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>
            )}

            <section aria-label="Typing practice area">
              <div style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
                {/* Typing progress bar */}
                {currentString.length > 0 && (
                  <div style={{
                    width: "100%",
                    height: 3,
                    borderRadius: 2,
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                    marginBottom: 8,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      borderRadius: 2,
                      background: "linear-gradient(90deg, var(--primary), var(--accent))",
                      width: `${Math.min((typedString.length / currentString.length) * 100, 100)}%`,
                      transition: "width 0.2s ease",
                    }} />
                  </div>
                )}

                <div style={{
                  width: "100%",
                  background: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  boxShadow: isDark
                    ? "0 4px 24px rgba(0,0,0,0.2)"
                    : "0 4px 24px rgba(0,0,0,0.04)",
                  padding: "16px 20px",
                  marginBottom: 12,
                  transition: "all var(--transition)",
                  opacity: isPaused ? 0.5 : 1,
                  filter: isPaused ? "blur(2px)" : "none",
                }}>
                  <TypingArea
                    originalString={currentString}
                    typedString={typedString}
                    keyboardType={keyboardType}
                  />
                </div>

                <div style={{
                  width: "100%",
                  background: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
                  boxShadow: isDark
                    ? "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                  padding: "8px",
                  transition: "all var(--transition)",
                }}>
                  <Keyboard
                    activeKey={activeKey}
                    keyboardType={keyboardType}
                    onKeyClick={handleKeyClick}
                    nextChar={typedString.length < currentString.length ? currentString[typedString.length] : undefined}
                  />
                </div>

                {showFingerGuide && (
                  <div style={{ width: "100%", marginTop: 12 }}>
                    <FingerGuide
                      keyboardType={keyboardType}
                      theme={theme}
                      activeKey={activeKey}
                      nextKeyChar={currentString[typedString.length] || ""}
                    />
                  </div>
                )}

                {showComplete && (
                  <div style={{
                    position: "absolute",
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 100,
                    animation: "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}>
                    <div style={{
                      background: isDark
                        ? "linear-gradient(135deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))"
                        : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      borderRadius: "var(--radius-xl)",
                      border: `1px solid ${isDark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.15)"}`,
                      boxShadow: isDark
                        ? "0 24px 48px rgba(0,0,0,0.4), 0 0 60px rgba(99,102,241,0.15)"
                        : "0 24px 48px rgba(0,0,0,0.1), 0 0 60px rgba(99,102,241,0.08)",
                      padding: "40px 56px",
                      textAlign: "center",
                      minWidth: 340,
                    }}>
                      <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--success), #16a34a)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
                        animation: "float 2s ease-in-out infinite",
                      }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <div style={{
                        fontSize: 22,
                        fontWeight: 700,
                        background: "linear-gradient(135deg, var(--primary), var(--accent))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: 8,
                      }}>
                        {practiceMode === "custom" ? "Text Complete!" : "Lesson Complete!"}
                      </div>
                      <div style={{
                        fontSize: 13,
                        color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
                        marginBottom: 20,
                      }}>
                        You&apos;ve completed this lesson
                      </div>
                      <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 32,
                        padding: "16px 0",
                        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                      }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--primary)", lineHeight: 1.2 }}>{wpm}</div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: isDark ? "var(--muted-dark)" : "var(--muted-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>WPM</div>
                        </div>
                        <div style={{ width: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 28, fontWeight: 700, color: accuracy >= 90 ? "var(--success)" : accuracy >= 70 ? "var(--warning)" : "var(--error)", lineHeight: 1.2 }}>{accuracy}%</div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: isDark ? "var(--muted-dark)" : "var(--muted-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Accuracy</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <p style={{
                  marginTop: 10,
                  textAlign: "center",
                  fontSize: 11,
                  color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
                  lineHeight: 1.5,
                  maxWidth: 500,
                }}>
                  {isPaused ? "Click Resume to continue typing." : "Type the highlighted text using your keyboard. Track your accuracy and WPM in real time."}
                </p>
              </div>
            </section>
          </>
        )}

        {(showStats || showAchievements || showScores) && (
          <div
            onClick={() => { setShowStats(false); setShowAchievements(false); setShowScores(false); }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              animation: "fadeIn 0.15s ease-out",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "90vw",
                maxWidth: 520,
                maxHeight: "80vh",
                overflowY: "auto",
                background: isDark ? "#1e293b" : "#ffffff",
                borderRadius: "var(--radius-lg)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.12)",
                animation: "scaleIn 0.2s ease-out",
                padding: 0,
              }}
            >
              <button
                onClick={() => { setShowStats(false); setShowAchievements(false); setShowScores(false); }}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 10,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: "none",
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  color: isDark ? "#f1f5f9" : "#0f172a",
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
                aria-label="Close"
              >
                ×
              </button>
              <div style={{ padding: 20 }}>
                {showStats && <StatisticsDashboard theme={theme} refreshKey={refreshKey} />}
                {showAchievements && <Achievements theme={theme} refreshKey={refreshKey} />}
                {showScores && <HighScores scores={mergedScores} theme={theme} />}
              </div>
            </div>
          </div>
        )}
      </main>

      <ToastNotifications toasts={toasts} theme={theme} />
    </div>
  );
}
