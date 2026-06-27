"use client";

import { useMemo, memo } from "react";
import KeyboardRow from "./KeyboardRow";
import { englishKeyboard, preetiKeyboard } from "@/data/keyboardLayouts";

interface KeyboardProps {
  activeKey: number;
  keyboardType: string;
  onKeyClick: (char: string, keyCode: number) => void;
  nextChar?: string;
}

function generateSecondaryKeys(keyboard: typeof englishKeyboard): Record<number, boolean> {
  const map: Record<number, boolean> = {};
  for (const row of keyboard) {
    for (const key of row) {
      if (key.secondaryKeyCode) {
        map[key.secondaryKeyCode] = true;
      }
    }
  }
  return map;
}

export default memo(function Keyboard({ activeKey, keyboardType, onKeyClick, nextChar }: KeyboardProps) {
  const layout = keyboardType === "traditional" ? preetiKeyboard : englishKeyboard;
  const secondaryKeys = useMemo(() => generateSecondaryKeys(layout), [layout]);
  const isSecondaryKey = !!secondaryKeys[activeKey];

  return (
    <div style={{ userSelect: "none" }} data-keyboard>
      {layout.map((row, index) => (
        <KeyboardRow
          key={index}
          keysData={row}
          activeKey={activeKey}
          isSecondaryKey={isSecondaryKey}
          keyboardType={keyboardType}
          onKeyClick={onKeyClick}
          nextChar={nextChar}
        />
      ))}
    </div>
  );
});
