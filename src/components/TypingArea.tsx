"use client";

import { memo } from "react";

interface TypingAreaProps {
  originalString: string;
  typedString: string;
  keyboardType: string;
}

export default memo(function TypingArea({ originalString, typedString, keyboardType }: TypingAreaProps) {
  const fontFamily = keyboardType === "traditional"
    ? "var(--font-nepali)"
    : "var(--font-sans)";

  const chars: React.ReactNode[] = [];

  for (let i = 0; i < originalString.length; i++) {
    if (i < typedString.length) {
      const isCorrect = originalString[i] === typedString[i];
      chars.push(
        <span
          key={i}
          style={{
            color: isCorrect ? "var(--success)" : "var(--error)",
            position: "relative",
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          {isCorrect ? originalString[i] : (
            <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
              {originalString[i]}
            </span>
          )}
        </span>
      );
    } else {
      chars.push(
        <span key={i} style={{ color: "inherit" }}>
          {originalString[i]}
        </span>
      );
    }
  }

  const cursorPos = typedString.length;

  return (
    <div style={{ fontSize: 24, fontFamily, padding: "4px 8px", lineHeight: 1.5 }}>
      {chars}
      {cursorPos < originalString.length && (
        <span style={{
          display: "inline-block",
          width: 2,
          height: "1.1em",
          background: "var(--primary)",
          marginLeft: 1,
          verticalAlign: "text-bottom",
          animation: "pulse 1s infinite",
          borderRadius: 1,
        }} />
      )}
    </div>
  );
});
