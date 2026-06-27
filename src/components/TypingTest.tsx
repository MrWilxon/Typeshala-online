"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import TypingArea from "./TypingArea";
import Keyboard from "./Keyboard";
import StatsBar from "./StatsBar";
import { recordSession, updateStreak } from "./StatisticsDashboard";
import { checkAchievements } from "./Achievements";
import { resumeAudioContext } from "@/lib/audio";
import { TimerIcon, CheckmarkIcon } from "./Icons";

interface TypingTestProps {
  keyboardType: string;
  theme: "light" | "dark";
  onComplete: () => void;
}

type TestDuration = 30 | 60 | 120 | 300;

const testTexts: Record<string, string[]> = {
  en: [
    "the quick brown fox jumps over the lazy dog pack my box with five dozen liquor jugs sphinx of black quartz judge my vow how vexingly quick daft zebras jump the five boxing wizards jump quickly",
    "typing is a skill that improves with practice the more you type the faster and more accurate you become keep your fingers on the home row and use proper finger placement for maximum speed",
    "nepali typing practice helps improve your speed and accuracy in typing nepali text using the preeti keyboard layout practice regularly to see improvement in your typing skills",
    "a journey of a thousand miles begins with a single step the secret of getting ahead is getting started the best time to plant a tree was twenty years ago the second best time is now",
    "practice makes perfect when you type regularly you build muscle memory and your fingers learn where each key is located without looking at the keyboard keep practicing every day",
    "the quick brown fox jumps over the lazy dog this sentence contains every letter of the english alphabet and is commonly used for typing practice and testing keyboard layouts",
    "learning to type fast is an essential skill in the modern world whether you are writing an email or coding a program typing speed and accuracy can significantly improve your productivity",
    "consistency is key when learning any new skill including typing practice for at least fifteen minutes every day and you will see steady improvement over time stay focused and determined",
  ],
  ne: [
    "कमल नमल म्यल तलम दलम पलम बलम भलम नमल तलम दलम पलम बलम भलम कमल नमल म्यल तलम दलम पलम बलम भलम",
    "क ख ग घ ङ च छ ज झ ञ त थ द ध न प फ ब भ म र ल व श ष स ह अ इ उ ए ओ कमल नमल म्यल तलम",
    "र ल व श ष स ह अ इ उ ए ओ कमल नमल म्यल तलम दलम पलम बलम भलम नमल तलम दलम पलम बलम भलम",
    "कमल नमल म्यल तलम दलम पलम बलम भलम क ख ग घ ङ च छ ज झ ञ त थ द ध न प फ ब भ म र ल व श ष स ह",
    "तलम दलम पलम बलम भलम कमल नमल म्यल अ इ उ ए ओ क ख ग घ ङ च छ ज झ ञ त थ द ध न प फ ब भ म",
    "नमल तलम दलम पलम बलम भलम कमल म्यल र ल व श ष स ह अ इ उ ए ओ क ख ग घ ङ च छ ज झ ञ त थ द ध न प",
    "बलम भलम कमल नमल म्यल तलम दलम पलम प फ ब भ म र ल व श ष स ह अ इ उ ए ओ क ख ग घ ङ च छ ज झ ञ",
    "म्यल तलम दलम पलम बलम भलम कमल नमल त थ द ध न प फ ब भ म र ल व श ष स ह अ इ उ ए ओ क ख ग घ ङ च",
  ],
};

function pickRandomText(language: string, exclude?: string): string {
  const texts = testTexts[language] || testTexts.en;
  let available = texts;
  if (exclude && texts.length > 1) {
    available = texts.filter((t) => t !== exclude);
  }
  return available[Math.floor(Math.random() * available.length)];
}

export default function TypingTest({ keyboardType, theme, onComplete }: TypingTestProps) {
  const [duration, setDuration] = useState<TestDuration>(60);
  const [testText, setTestText] = useState("");
  const [typedString, setTypedString] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [finalWpm, setFinalWpm] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(0);
  const [finalCharsTyped, setFinalCharsTyped] = useState(0);
  const [activeKey, setActiveKey] = useState<number>(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const typedLenRef = useRef(0);
  const wpmRef = useRef(0);
  const accuracyRef = useRef(0);
  const language = keyboardType === "traditional" ? "ne" : "en";
  const shiftHeldRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const calculateStats = useCallback((typed: string, target: string) => {
    if (typed.length === 0) {
      setAccuracy(0);
      setWpm(0);
      accuracyRef.current = 0;
      wpmRef.current = 0;
      return;
    }
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (i < target.length && typed[i] === target[i]) correct++;
    }
    const acc = Math.floor((100 * correct) / typed.length);
    setAccuracy(acc);
    accuracyRef.current = acc;
  }, []);

  const finalizeTest = useCallback((currentWpm: number, currentAccuracy: number, typed: string, elapsedSec: number) => {
    setFinalWpm(currentWpm);
    setFinalAccuracy(currentAccuracy);
    setFinalCharsTyped(typed.length);
    setShowResults(true);

    const wordsTyped = Math.floor(typed.length / 5);
    recordSession(currentWpm, currentAccuracy, wordsTyped, elapsedSec);
    const newStreak = updateStreak();
    onComplete();
    checkAchievements();
  }, [onComplete]);

  const startTest = useCallback(() => {
    const text = pickRandomText(language);
    setTestText(text);
    setTypedString("");
    setIsActive(true);
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(0);
    setElapsed(0);
    setShowResults(false);
    wpmRef.current = 0;
    accuracyRef.current = 0;
    typedLenRef.current = 0;
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
      setElapsed((Date.now() - (startTimeRef.current || Date.now())) / 1000);
    }, 1000);
  }, [duration, language]);

  useEffect(() => {
    if (timeLeft === 0 && isActive === false && showResults === false && startTimeRef.current !== null) {
      const totalElapsed = (Date.now() - startTimeRef.current) / 1000;
      finalizeTest(wpmRef.current, accuracyRef.current, typedLenRef.current > 0 ? typedString : "", totalElapsed);
    }
  }, [timeLeft, isActive, showResults, typedString, finalizeTest]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (e.key === "Tab") { e.preventDefault(); return; }

      if (e.key === "Shift") {
        shiftHeldRef.current = true;
        return;
      }

      resumeAudioContext();

      setActiveKey(e.keyCode);

      if (e.key === "Backspace") {
        e.preventDefault();
        setTypedString((prev) => {
          const next = prev.slice(0, -1);
          calculateStats(next, testText);
          if (startTimeRef.current) {
            const elapsedMinutes = (Date.now() - startTimeRef.current) / 1000 / 60;
            if (elapsedMinutes > 0) {
              const words = next.length / 5;
              const newWpm = Math.round(words / elapsedMinutes);
              setWpm(newWpm);
              wpmRef.current = newWpm;
            }
          }
          return next;
        });
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        const char = e.key;
        setTypedString((prev) => {
          const next = prev + char;
          calculateStats(next, testText);

          if (startTimeRef.current) {
            const elapsedMinutes = (Date.now() - startTimeRef.current) / 1000 / 60;
            if (elapsedMinutes > 0) {
              const words = next.length / 5;
              const newWpm = Math.round(words / elapsedMinutes);
              setWpm(newWpm);
              wpmRef.current = newWpm;
            }
          }

          return next;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        shiftHeldRef.current = false;
      }
      if (shiftHeldRef.current && e.key !== "Shift") {
        return;
      }
      setActiveKey(0);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isActive, testText, calculateStats]);

  const endTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    const totalElapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : elapsed;
    finalizeTest(wpmRef.current, accuracyRef.current, typedLenRef.current > 0 ? typedString : "", totalElapsed);
  }, [elapsed, finalizeTest, typedString]);

  const handleKeyClick = useCallback((char: string, keyCode: number) => {
    if (!isActive) return;
    if (!char && keyCode !== 8 && keyCode !== 13) return;

    const targetStr = testText;

    if (keyCode === 8) {
      setTypedString((prev) => {
        const next = prev.slice(0, -1);
        calculateStats(next, targetStr);
        if (startTimeRef.current) {
          const elapsedMinutes = (Date.now() - startTimeRef.current) / 1000 / 60;
          if (elapsedMinutes > 0) {
            const words = next.length / 5;
            const newWpm = Math.round(words / elapsedMinutes);
            setWpm(newWpm);
            wpmRef.current = newWpm;
          }
        }
        return next;
      });
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    if (char) {
      setActiveKey(keyCode);
      setTypedString((prev) => {
        const next = prev + char;
        calculateStats(next, targetStr);
        if (startTimeRef.current) {
          const elapsedMinutes = (Date.now() - startTimeRef.current) / 1000 / 60;
          if (elapsedMinutes > 0) {
            const words = next.length / 5;
            const newWpm = Math.round(words / elapsedMinutes);
            setWpm(newWpm);
            wpmRef.current = newWpm;
          }
        }
        return next;
      });
    }
  }, [isActive, testText, calculateStats]);

  const isDark = theme === "dark";
  const timeDisplay = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`;

  return (
    <div style={{
      background: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(20px)",
      borderRadius: "var(--radius-lg)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      padding: 24,
      marginBottom: 24,
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <TimerIcon />
        Typing Test
      </div>

      {!isActive && !showResults && (
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ marginBottom: 16, fontSize: 13, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>
            Choose test duration:
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
            {([30, 60, 120, 300] as TestDuration[]).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: duration === d
                    ? "linear-gradient(135deg, var(--primary), var(--accent))"
                    : isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
                  color: duration === d ? "white" : isDark ? "#f1f5f9" : "#0f172a",
                  border: `1px solid ${duration === d ? "transparent" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
              >
                {d === 30 ? "Warm-up" : d === 60 ? "1 min" : d === 120 ? "2 min" : "5 min"}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 12, fontSize: 13, color: isDark ? "var(--muted-dark)" : "var(--muted-light)" }}>
            Language: {keyboardType === "traditional" ? "Nepali (Preeti)" : "English"}
          </div>
          <button
            onClick={startTest}
            style={{
              padding: "10px 24px",
              borderRadius: "var(--radius-sm)",
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
          >
            Start Test
          </button>
        </div>
      )}

      {isActive && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              color: timeLeft <= 10 ? "var(--error)" : "var(--primary)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {timeDisplay}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                fontSize: 13,
                color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
              }}>
                {typedString.length} / {testText.length} chars
              </div>
              <button
                onClick={endTest}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "var(--error)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                End Test
              </button>
            </div>
          </div>
          <StatsBar wpm={wpm} accuracy={accuracy} elapsed={elapsed} theme={theme} />
          <div style={{
            padding: "20px 16px",
            fontSize: 20,
            lineHeight: 1.8,
            fontFamily: keyboardType === "traditional" ? "var(--font-nepali)" : "var(--font-sans)",
            background: isDark ? "rgba(15, 23, 42, 0.3)" : "rgba(248, 250, 252, 0.8)",
            borderRadius: "var(--radius-md)",
            marginBottom: 16,
          }}>
            <TypingArea originalString={testText} typedString={typedString} keyboardType={keyboardType} />
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
            padding: "16px",
            transition: "all var(--transition)",
          }}>
            <Keyboard
              activeKey={activeKey}
              keyboardType={keyboardType}
              onKeyClick={handleKeyClick}
            />
          </div>
        </div>
      )}

      {showResults && (
        <div style={{ textAlign: "center", padding: 20, animation: "scaleIn 0.3s ease-out" }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <CheckmarkIcon />
          </div>
          <div style={{
            fontSize: 20,
            fontWeight: 700,
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 16,
          }}>
            Test Complete!
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginBottom: 24,
          }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--primary)" }}>{finalWpm}</div>
              <div style={{ fontSize: 11, color: isDark ? "var(--muted-dark)" : "var(--muted-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>WPM</div>
            </div>
            <div>
              <div style={{
                fontSize: 32,
                fontWeight: 700,
                color: finalAccuracy >= 90 ? "var(--success)" : finalAccuracy >= 70 ? "var(--warning)" : "var(--error)",
              }}>{finalAccuracy}%</div>
              <div style={{ fontSize: 11, color: isDark ? "var(--muted-dark)" : "var(--muted-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Accuracy</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--accent)" }}>{finalCharsTyped}</div>
              <div style={{ fontSize: 11, color: isDark ? "var(--muted-dark)" : "var(--muted-light)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Characters</div>
            </div>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
          }}>
            <button
              onClick={startTest}
              style={{
                padding: "10px 24px",
                borderRadius: "var(--radius-sm)",
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => { setShowResults(false); onComplete(); }}
              style={{
                padding: "10px 24px",
                borderRadius: "var(--radius-sm)",
                background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.8)",
                color: isDark ? "#f1f5f9" : "#0f172a",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              Back to Lessons
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
