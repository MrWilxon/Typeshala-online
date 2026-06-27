import {
  STORAGE_PROGRESS,
  STORAGE_THEME,
  STORAGE_LOCAL_SCORES,
  STORAGE_STATS,
  STORAGE_ACHIEVEMENTS,
  STORAGE_STREAK,
} from "@/lib/storageKeys";

describe("storageKeys", () => {
  it("exports all expected keys", () => {
    expect(STORAGE_PROGRESS).toBe("typeshala_progress");
    expect(STORAGE_THEME).toBe("typeshala_theme");
    expect(STORAGE_LOCAL_SCORES).toBe("typeshala_local_scores");
    expect(STORAGE_STATS).toBe("typeshala_stats");
    expect(STORAGE_ACHIEVEMENTS).toBe("typeshala_achievements");
    expect(STORAGE_STREAK).toBe("typeshala_streak");
  });

  it("all keys are unique", () => {
    const keys = [
      STORAGE_PROGRESS,
      STORAGE_THEME,
      STORAGE_LOCAL_SCORES,
      STORAGE_STATS,
      STORAGE_ACHIEVEMENTS,
      STORAGE_STREAK,
    ];
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });

  it("all keys start with typeshala_", () => {
    const keys = [
      STORAGE_PROGRESS,
      STORAGE_THEME,
      STORAGE_LOCAL_SCORES,
      STORAGE_STATS,
      STORAGE_ACHIEVEMENTS,
      STORAGE_STREAK,
    ];
    keys.forEach((key) => {
      expect(key).toMatch(/^typeshala_/);
    });
  });
});
