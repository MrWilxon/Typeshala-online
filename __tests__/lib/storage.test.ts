import { loadFromStorage, saveToStorage, removeFromStorage } from "@/lib/storage";

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  describe("loadFromStorage", () => {
    it("returns fallback when window is undefined (SSR)", () => {
      const original = global.window;
      // @ts-expect-error - testing SSR scenario
      delete global.window;
      const result = loadFromStorage("key", "fallback");
      expect(result).toBe("fallback");
      global.window = original;
    });

    it("returns fallback when key does not exist in localStorage", () => {
      const result = loadFromStorage("nonexistent", "fallback");
      expect(result).toBe("fallback");
    });

    it("returns parsed JSON when key exists", () => {
      localStorage.setItem("test-key", JSON.stringify({ wpm: 42 }));
      const result = loadFromStorage("test-key", {});
      expect(result).toEqual({ wpm: 42 });
    });

    it("returns fallback when stored value is invalid JSON", () => {
      localStorage.setItem("bad-key", "not-json{{{");
      const result = loadFromStorage("bad-key", "default");
      expect(result).toBe("default");
    });

    it("works with arrays", () => {
      localStorage.setItem("arr", JSON.stringify([1, 2, 3]));
      const result = loadFromStorage("arr", []);
      expect(result).toEqual([1, 2, 3]);
    });

    it("works with primitive types", () => {
      localStorage.setItem("str", JSON.stringify("hello"));
      localStorage.setItem("num", JSON.stringify(99));
      localStorage.setItem("bool", JSON.stringify(true));
      expect(loadFromStorage("str", "")).toBe("hello");
      expect(loadFromStorage("num", 0)).toBe(99);
      expect(loadFromStorage("bool", false)).toBe(true);
    });
  });

  describe("saveToStorage", () => {
    it("stores value as JSON string", () => {
      saveToStorage("key", { a: 1 });
      expect(localStorage.getItem("key")).toBe('{"a":1}');
    });

    it("overwrites existing value", () => {
      saveToStorage("key", "old");
      saveToStorage("key", "new");
      expect(localStorage.getItem("key")).toBe('"new"');
    });

    it("handles various types", () => {
      saveToStorage("str", "text");
      saveToStorage("num", 42);
      saveToStorage("bool", false);
      saveToStorage("arr", [1, 2]);
      saveToStorage("obj", { nested: true });

      expect(JSON.parse(localStorage.getItem("str")!)).toBe("text");
      expect(JSON.parse(localStorage.getItem("num")!)).toBe(42);
      expect(JSON.parse(localStorage.getItem("bool")!)).toBe(false);
      expect(JSON.parse(localStorage.getItem("arr")!)).toEqual([1, 2]);
      expect(JSON.parse(localStorage.getItem("obj")!)).toEqual({ nested: true });
    });
  });

  describe("removeFromStorage", () => {
    it("removes existing key", () => {
      localStorage.setItem("to-remove", "value");
      removeFromStorage("to-remove");
      expect(localStorage.getItem("to-remove")).toBeNull();
    });

    it("does not throw when key does not exist", () => {
      expect(() => removeFromStorage("nonexistent")).not.toThrow();
    });
  });
});
