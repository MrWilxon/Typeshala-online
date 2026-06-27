import { saveScore, getScores } from "@/lib/api";

const API_BASE = "http://localhost:4000/api";

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("api", () => {
  describe("saveScore", () => {
    it("sends POST request with score data", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });
      global.fetch = mockFetch;

      await saveScore({
        wpm: 50,
        accuracy: 95,
        lesson: "en_mid1",
        setType: "midRow",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE}/scores`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wpm: 50,
            accuracy: 95,
            lesson: "en_mid1",
            setType: "midRow",
          }),
        })
      );
    });

    it("does not throw when backend is unavailable", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));
      await expect(
        saveScore({ wpm: 50, accuracy: 95, lesson: "en_mid1", setType: "midRow" })
      ).resolves.not.toThrow();
    });

    it("does not throw when response is not ok", async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
      await expect(
        saveScore({ wpm: 50, accuracy: 95, lesson: "en_mid1", setType: "midRow" })
      ).resolves.not.toThrow();
    });
  });

  describe("getScores", () => {
    it("returns scores from backend", async () => {
      const scores = [
        { wpm: 50, accuracy: 95, lesson: "en_mid1", setType: "midRow" },
        { wpm: 60, accuracy: 98, lesson: "en_top1", setType: "topRow" },
      ];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => scores,
      });

      const result = await getScores();
      expect(result).toEqual(scores);
    });

    it("returns empty array when backend is unavailable", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Connection refused"));
      const result = await getScores();
      expect(result).toEqual([]);
    });

    it("returns empty array when response is not ok", async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
      const result = await getScores();
      expect(result).toEqual([]);
    });

    it("returns empty array when JSON parsing fails", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });
      const result = await getScores();
      expect(result).toEqual([]);
    });

    it("passes abort signal to fetch", async () => {
      const controller = new AbortController();
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      });
      global.fetch = mockFetch;

      await getScores(controller.signal);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ signal: controller.signal })
      );
    });
  });
});
