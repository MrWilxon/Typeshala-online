import {
  englishKeyboard,
  preetiKeyboard,
  type KeyboardLayout,
  type KeyData,
  type SetType,
} from "@/data/keyboardLayouts";

describe("keyboardLayouts", () => {
  describe("englishKeyboard", () => {
    it("has 5 rows", () => {
      expect(englishKeyboard).toHaveLength(5);
    });

    it("has number row with 14 keys (13 keys + backspace)", () => {
      expect(englishKeyboard[0]).toHaveLength(14);
    });

    it("has QWERTY row starting with tab", () => {
      expect(englishKeyboard[1][0].special).toBe("tab");
    });

    it("has home row starting with caps lock", () => {
      expect(englishKeyboard[2][0].special).toBe("caps lock");
    });

    it("has bottom row with shift keys", () => {
      const row = englishKeyboard[3];
      expect(row[0].special).toBe("shift");
      expect(row[row.length - 1].special).toBe("shift");
    });

    it("has space bar in bottom row", () => {
      const row = englishKeyboard[4];
      const spaceBar = row.find((k) => k.special === "space bar");
      expect(spaceBar).toBeDefined();
    });

    it("every key has required fields", () => {
      englishKeyboard.forEach((row) => {
        row.forEach((key) => {
          expect(key).toHaveProperty("mainChar");
          expect(key).toHaveProperty("secondaryChar");
          expect(key).toHaveProperty("special");
          expect(key).toHaveProperty("keyCode");
          expect(typeof key.keyCode).toBe("number");
        });
      });
    });

    it("Q key is in the correct position", () => {
      const qKey = englishKeyboard[1][1];
      expect(qKey.mainChar).toBe("q");
      expect(qKey.secondaryChar).toBe("Q");
      expect(qKey.special).toBe(false);
    });

    it("has enter key in home row", () => {
      const row = englishKeyboard[2];
      const enterKey = row.find((k) => k.special === "enter");
      expect(enterKey).toBeDefined();
    });
  });

  describe("preetiKeyboard", () => {
    it("has 5 rows", () => {
      expect(preetiKeyboard).toHaveLength(5);
    });

    it("has same structure as English keyboard", () => {
      expect(preetiKeyboard.length).toBe(englishKeyboard.length);
      preetiKeyboard.forEach((row, i) => {
        expect(row.length).toBe(englishKeyboard[i].length);
      });
    });

    it("has Nepali characters in main positions", () => {
      // q maps to क in Preeti
      const qKey = preetiKeyboard[1][1];
      expect(qKey.mainChar).toBe("क");
    });

    it("has special keys matching English layout", () => {
      // Backspace is last key in row 0
      const backspace = preetiKeyboard[0][preetiKeyboard[0].length - 1];
      expect(backspace.special).toBe("backspace");
      expect(preetiKeyboard[1][0].special).toBe("tab");
      expect(preetiKeyboard[2][0].special).toBe("caps lock");
    });

    it("every key has valid keyCode", () => {
      preetiKeyboard.forEach((row) => {
        row.forEach((key) => {
          expect(typeof key.keyCode).toBe("number");
          expect(key.keyCode).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });

  describe("SetType", () => {
    it("accepts valid set types", () => {
      const validTypes: SetType[] = ["numRow", "topRow", "midRow", "lowRow", "allKeys"];
      validTypes.forEach((t) => {
        expect(["numRow", "topRow", "midRow", "lowRow", "allKeys"]).toContain(t);
      });
    });
  });
});
