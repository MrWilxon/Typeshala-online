"use client";

interface FingerGuideProps {
  keyboardType: string;
  theme: "light" | "dark";
  activeKey?: number;
  nextKeyChar?: string;
}

const FINGER_COLORS: Record<string, string> = {
  lp: "#ef4444", lr: "#f97316", lm: "#eab308", li: "#22c55e",
  ri: "#06b6d4", rm: "#3b82f6", rr: "#8b5cf6", rp: "#ec4899",
  thumb: "#78716c",
};

const FINGER_LABELS: Record<string, string> = {
  lp: "Pinky", lr: "Ring", lm: "Middle", li: "Index",
  ri: "Index", rm: "Middle", rr: "Ring", rp: "Pinky", thumb: "Thumb",
};

type FingerId = "lp" | "lr" | "lm" | "li" | "ri" | "rm" | "rr" | "rp" | "thumb";

const englishKeyToFinger: Record<number, FingerId> = {
  96: "lp", 126: "lp", 49: "lp", 33: "lp",
  50: "lr", 64: "lr", 51: "lm", 35: "lm",
  52: "li", 36: "li", 53: "li", 37: "li",
  54: "ri", 94: "ri", 55: "ri", 38: "ri",
  56: "rm", 42: "rm", 57: "rr", 40: "rr",
  48: "rp", 41: "rp", 45: "rp", 95: "rp", 61: "rp", 43: "rp",
  81: "lp", 113: "lp", 87: "lr", 119: "lr",
  69: "lm", 101: "lm", 82: "li", 114: "li", 84: "li", 116: "li",
  89: "ri", 121: "ri", 85: "ri", 117: "ri",
  73: "rm", 105: "rm", 79: "rr", 111: "rr", 80: "rp", 112: "rp",
  65: "lp", 97: "lp", 83: "lr", 115: "lr",
  68: "lm", 100: "lm", 70: "li", 102: "li", 71: "li", 103: "li",
  72: "ri", 104: "ri", 74: "ri", 106: "ri",
  75: "rm", 107: "rm", 76: "rr", 108: "rr",
  59: "rp", 186: "rp", 39: "rp", 222: "rp",
  90: "lp", 122: "lp", 88: "lr", 120: "lr",
  67: "lm", 99: "lm", 86: "li", 118: "li", 66: "li", 98: "li",
  78: "ri", 110: "ri", 77: "ri", 109: "ri",
  188: "rm", 44: "rm", 190: "rr", 46: "rr", 191: "rp", 63: "rp",
  32: "thumb",
};

const nepaliKeyToFinger: Record<number, FingerId> = {
  49: "lp", 33: "lp", 50: "lr", 64: "lr", 51: "lm", 35: "lm",
  52: "li", 36: "li", 53: "li", 37: "li",
  54: "ri", 94: "ri", 55: "ri", 38: "ri",
  56: "rm", 42: "rm", 57: "rr", 40: "rr",
  48: "rp", 41: "rp", 45: "rp", 95: "rp", 61: "rp", 43: "rp",
  113: "lp", 119: "lr", 101: "lm", 114: "li", 116: "li",
  121: "ri", 117: "ri", 105: "rm", 111: "rr", 112: "rp",
  97: "lp", 115: "lr", 100: "lm", 102: "li", 103: "li",
  104: "ri", 106: "ri", 107: "rm", 108: "rr", 59: "rp", 39: "rp",
  122: "lp", 120: "lr", 99: "lm", 118: "li", 98: "li",
  110: "ri", 109: "ri", 44: "rm", 46: "rr", 63: "rp",
  32: "thumb",
};

function LeftHand({ activeFingers, isDark }: { activeFingers: Set<FingerId>; isDark: boolean }) {
  const skin = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)";
  const outline = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)";

  const fp = (id: FingerId, d: string) => {
    const active = activeFingers.has(id);
    const color = FINGER_COLORS[id];
    return (
      <path
        key={id}
        d={d}
        fill={active ? color + "30" : skin}
        stroke={active ? color : outline}
        strokeWidth={active ? 2.5 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "all 0.2s ease" }}
      />
    );
  };

  return (
    <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
      {/* Palm */}
      <path
        d="M30 55 C30 48, 35 42, 42 42 L95 42 C102 42, 108 48, 108 55 L108 95 C108 105, 100 112, 90 112 L48 112 C38 112, 30 105, 30 95 Z"
        fill={skin}
        stroke={outline}
        strokeWidth="1.5"
      />
      {/* Fingers */}
      {fp("lp", "M34 42 C34 28, 32 20, 34 14 C36 8, 42 8, 44 14 C46 20, 44 28, 44 42")}
      {fp("lr", "M48 42 C48 26, 46 16, 48 10 C50 4, 56 4, 58 10 C60 16, 58 26, 58 42")}
      {fp("lm", "M62 42 C62 22, 60 12, 62 6 C64 0, 70 0, 72 6 C74 12, 72 22, 72 42")}
      {fp("li", "M76 42 C76 26, 74 16, 76 10 C78 4, 84 4, 86 10 C88 16, 86 26, 86 42")}
      {/* Thumb */}
      {fp("thumb", "M108 58 C112 52, 118 46, 122 42 C126 38, 130 40, 128 46 C126 52, 120 60, 112 66")}
    </svg>
  );
}

function RightHand({ activeFingers, isDark }: { activeFingers: Set<FingerId>; isDark: boolean }) {
  const skin = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)";
  const outline = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)";

  const fp = (id: FingerId, d: string) => {
    const active = activeFingers.has(id);
    const color = FINGER_COLORS[id];
    return (
      <path
        key={id}
        d={d}
        fill={active ? color + "30" : skin}
        stroke={active ? color : outline}
        strokeWidth={active ? 2.5 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "all 0.2s ease" }}
      />
    );
  };

  return (
    <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
      {/* Palm */}
      <path
        d="M32 55 C32 48, 38 42, 45 42 L98 42 C105 42, 110 48, 110 55 L110 95 C110 105, 102 112, 92 112 L50 112 C40 112, 32 105, 32 95 Z"
        fill={skin}
        stroke={outline}
        strokeWidth="1.5"
      />
      {/* Fingers */}
      {fp("ri", "M54 42 C54 26, 52 16, 54 10 C56 4, 62 4, 64 10 C66 16, 64 26, 64 42")}
      {fp("rm", "M68 42 C68 22, 66 12, 68 6 C70 0, 76 0, 78 6 C80 12, 78 22, 78 42")}
      {fp("rr", "M82 42 C82 26, 80 16, 82 10 C84 4, 90 4, 92 10 C94 16, 92 26, 92 42")}
      {fp("rp", "M96 42 C96 28, 94 20, 96 14 C98 8, 104 8, 106 14 C108 20, 106 28, 106 42")}
      {/* Thumb */}
      {fp("thumb", "M32 58 C28 52, 22 46, 18 42 C14 38, 10 40, 12 46 C14 52, 20 60, 28 66")}
    </svg>
  );
}

export default function FingerGuide({ keyboardType, theme, activeKey, nextKeyChar }: FingerGuideProps) {
  const isDark = theme === "dark";
  const keyMap = keyboardType === "traditional" ? nepaliKeyToFinger : englishKeyToFinger;

  const activeFinger = activeKey ? keyMap[activeKey] : undefined;
  const activeFingers = new Set<FingerId>(activeFinger ? [activeFinger] : []);

  let nextFinger: FingerId | null = null;
  let nextFingerHand: "Left" | "Right" = "Left";
  if (nextKeyChar) {
    const lowerCode = nextKeyChar.toLowerCase().charCodeAt(0);
    const charCode = nextKeyChar.charCodeAt(0);
    nextFinger = keyMap[lowerCode] || keyMap[charCode] || null;
    if (nextFinger) {
      nextFingerHand = ["ri", "rm", "rr", "rp"].includes(nextFinger) ? "Right" : "Left";
    }
  }

  const getLabel = (id: FingerId) => `${FINGER_LABELS[id]} (${nextFingerHand} ${FINGER_LABELS[id]})`;

  return (
    <div style={{
      background: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.5)",
      backdropFilter: "blur(12px)",
      borderRadius: "var(--radius-md)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
      padding: "12px 16px",
    }}>
      {/* Next finger hint banner */}
      {nextFinger && (
        <div style={{
          textAlign: "center",
          marginBottom: 12,
          padding: "6px 16px",
          borderRadius: 8,
          background: `linear-gradient(135deg, ${FINGER_COLORS[nextFinger]}12, ${FINGER_COLORS[nextFinger]}08)`,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: `${FINGER_COLORS[nextFinger]}30`,
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: FINGER_COLORS[nextFinger],
            letterSpacing: "0.02em",
          }}>
            Use {getLabel(nextFinger)}
          </span>
        </div>
      )}

      {/* Hands */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <LeftHand activeFingers={activeFingers} isDark={isDark} />
        <RightHand activeFingers={activeFingers} isDark={isDark} />
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 8,
        marginTop: 10,
      }}>
        {(["lp", "lr", "lm", "li", "ri", "rm", "rr", "rp"] as FingerId[]).map((id) => (
          <div key={id} style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            padding: "2px 6px",
            borderRadius: 4,
            background: activeFingers.has(id) ? FINGER_COLORS[id] + "15" : "transparent",
            transition: "background 0.2s ease",
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: 2,
              background: FINGER_COLORS[id],
              opacity: activeFingers.has(id) ? 1 : 0.5,
              transition: "opacity 0.2s ease",
            }} />
            <span style={{
              fontSize: 9,
              fontWeight: activeFingers.has(id) ? 600 : 400,
              color: isDark ? "var(--muted-dark)" : "var(--muted-light)",
              transition: "all 0.2s ease",
            }}>
              {FINGER_LABELS[id]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
