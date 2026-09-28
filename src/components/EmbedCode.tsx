"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "./Icons";
import { SITE } from "@/lib/seo";

interface EmbedCodeProps {
  keyboardType: string;
  theme: "light" | "dark";
}

export function EmbedCode({ keyboardType, theme }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";

  const path = keyboardType === "traditional" ? "/embed" : "/embed/en";
  const embedUrl = `${SITE.url}${path}`;
  const snippet = `<iframe src="${embedUrl}" width="100%" height="700" style="border:none;border-radius:12px;overflow:hidden;" title="Typeshala Typing Tutor" loading="lazy" allowfullscreen></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable; user can select the text manually */
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
  };

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Embed Typeshala</div>
      <p style={{ ...labelStyle, marginBottom: 12, lineHeight: 1.5 }}>
        Paste this snippet into your website&apos;s HTML to embed the typing tutor
        {keyboardType === "traditional" ? " (Nepali mode)" : " (English mode)"}.
      </p>
      <textarea
        readOnly
        value={snippet}
        onFocus={(e) => e.target.select()}
        rows={4}
        style={{
          width: "100%",
          resize: "none",
          fontFamily: "monospace",
          fontSize: 12,
          padding: 10,
          borderRadius: 8,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          background: isDark ? "rgba(15,23,42,0.6)" : "rgba(248,250,252,0.9)",
          color: isDark ? "#f1f5f9" : "#0f172a",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: "white",
            background: copied ? "var(--success)" : "linear-gradient(135deg, var(--primary), var(--accent))",
            transition: "background 0.15s ease",
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy code"}
        </button>
        {copied && <span style={labelStyle}>Copied to clipboard</span>}
      </div>
    </div>
  );
}
