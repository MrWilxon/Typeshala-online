"use client";

import { memo } from "react";
import KeyboardKey from "./KeyboardKey";
import type { KeyboardRow as KeyboardRowType } from "@/data/keyboardLayouts";

interface KeyboardRowProps {
  keysData: KeyboardRowType;
  activeKey: number;
  isSecondaryKey: boolean;
  keyboardType: string;
  onKeyClick: (char: string, keyCode: number) => void;
  nextChar?: string;
}

export default memo(function KeyboardRow({ keysData, activeKey, isSecondaryKey, keyboardType, onKeyClick, nextChar }: KeyboardRowProps) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 3 }}>
      {keysData.map((data, index) => {
        let selected = activeKey !== 0 && (data.keyCode === activeKey || data.secondaryKeyCode === activeKey);
        if (isSecondaryKey && data.keyCode === 16) {
          selected = true;
        }
        const isNextKey = nextChar ? data.mainChar === nextChar || data.secondaryChar === nextChar : false;
        return (
          <KeyboardKey key={index} data={data} selected={selected} isNextKey={isNextKey} keyboardType={keyboardType} onKeyClick={onKeyClick} />
        );
      })}
    </div>
  );
});
