"use client";

import { useCallback, useRef, memo } from "react";
import type { KeyData } from "@/data/keyboardLayouts";

interface KeyboardKeyProps {
  data: KeyData;
  selected: boolean;
  isNextKey: boolean;
  keyboardType: string;
  onKeyClick: (char: string, keyCode: number) => void;
}

export default memo(function KeyboardKey({ data, selected, isNextKey, keyboardType, onKeyClick }: KeyboardKeyProps) {
  const keyRef = useRef<HTMLDivElement>(null);

  const keyWidth = data.special
    ? data.special === "space bar"
      ? 260
      : data.special === "backspace" || data.special === "caps lock" || data.special === "enter"
        ? 68
        : data.special === "shift"
          ? 76
          : data.special === "tab"
            ? 56
            : data.special === "command"
              ? 58
              : 46
    : 40;

  const createRipple = useCallback((e: React.MouseEvent) => {
    const el = keyRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 0.8;
    ripple.className = "key-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    createRipple(e);
    if (data.special === "backspace") {
      onKeyClick("", 8);
    } else if (data.mainChar) {
      onKeyClick(data.mainChar, data.keyCode);
    }
  }, [data, onKeyClick, createRipple]);

  return (
    <div
      ref={keyRef}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={data.special ? data.special : data.mainChar}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(e as unknown as React.MouseEvent); } }}
      onTouchEnd={(e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const mouseEvent = { clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent;
        createRipple(mouseEvent);
        if (data.special === "backspace") {
          onKeyClick("", 8);
        } else if (data.mainChar) {
          onKeyClick(data.mainChar, data.keyCode);
        }
      }}
      style={{
        background: selected
          ? "linear-gradient(135deg, var(--primary), #4f46e5)"
          : isNextKey
            ? "rgba(34, 197, 94, 0.2)"
            : "rgba(148, 163, 184, 0.05)",
        color: selected ? "white" : "inherit",
        margin: 0,
        borderRadius: 6,
        position: "relative",
        width: keyWidth,
        height: 38,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: keyboardType === "traditional" ? "var(--font-nepali)" : "var(--font-sans)",
        cursor: "pointer",
        userSelect: "none",
        overflow: "hidden",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: selected
          ? "rgba(99,102,241,0.5)"
          : isNextKey
            ? "rgba(34,197,94,0.4)"
            : "rgba(148,163,184,0.15)",
        boxShadow: selected
          ? "0 3px 8px rgba(99,102,241,0.3)"
          : isNextKey
            ? "0 0 12px rgba(34,197,94,0.3)"
            : "0 1px 2px rgba(0,0,0,0.03)",
        transition: "all 0.12s ease",
        backdropFilter: selected ? "blur(4px)" : "none",
        WebkitBackdropFilter: selected ? "blur(4px)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = isNextKey ? "rgba(34,197,94,0.6)" : "rgba(99,102,241,0.3)";
          e.currentTarget.style.background = isNextKey ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.06)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = isNextKey ? "rgba(34,197,94,0.4)" : "rgba(148,163,184,0.15)";
          e.currentTarget.style.background = isNextKey ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.05)";
        }
      }}
    >
      <div style={{
        fontSize: 9,
        position: "absolute",
        top: 2,
        right: 4,
        fontFamily: "var(--font-sans)",
        opacity: 0.35,
        fontWeight: 500,
      }}>
        {data.secondaryChar || ""}
      </div>
      <div style={{
        fontSize: data.special ? 10 : 15,
        textAlign: "center",
        fontWeight: data.special ? 500 : 400,
        lineHeight: 1,
        position: "relative",
        zIndex: 1,
      }}>
        {data.special
          ? data.special === "space bar" ? "" : data.special === "backspace" ? "⌫" : data.special === "caps lock" ? "⇪" : data.special === "enter" ? "↵" : data.special === "shift" ? "⇧" : data.special === "tab" ? "⇥" : data.special === "fn" ? "Fn" : data.special === "control" ? "Ctrl" : data.special === "alt" ? "Alt" : data.special === "command" ? "⌘" : data.special
          : data.mainChar
        }
      </div>
    </div>
  );
});
