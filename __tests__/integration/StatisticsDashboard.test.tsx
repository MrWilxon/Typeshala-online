/**
 * Integration tests for StatisticsDashboard component
 *
 * Tests stats loading, display, export functionality, and recent activity.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StatisticsDashboard, {
  loadStats,
  recordSession,
  updateStreak,
  loadStreak,
} from "@/components/StatisticsDashboard";
import { STORAGE_STATS, STORAGE_STREAK } from "@/lib/storageKeys";

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("StatisticsDashboard", () => {
  const defaultProps = {
    theme: "light" as const,
    refreshKey: 0,
  };

  describe("rendering", () => {
    it("renders the dashboard heading", () => {
      render(<StatisticsDashboard {...defaultProps} />);
      expect(screen.getByText("Statistics Dashboard")).toBeInTheDocument();
    });

    it("shows refresh button", () => {
      render(<StatisticsDashboard {...defaultProps} />);
      expect(screen.getByText("Refresh")).toBeInTheDocument();
    });

    it("displays stat cards", () => {
      render(<StatisticsDashboard {...defaultProps} />);
      expect(screen.getByText("Sessions")).toBeInTheDocument();
      expect(screen.getByText("Words Typed")).toBeInTheDocument();
      expect(screen.getByText("Avg WPM")).toBeInTheDocument();
      expect(screen.getByText("Best WPM")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("shows zero stats when no data", () => {
      render(<StatisticsDashboard {...defaultProps} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("with data", () => {
    it("displays recorded stats", () => {
      localStorage.setItem(
        STORAGE_STATS,
        JSON.stringify({
          totalSessions: 10,
          totalWordsTyped: 500,
          averageWpm: 45,
          bestWpm: 60,
          averageAccuracy: 92,
          bestAccuracy: 98,
          totalTimeTyped: 300,
          dailyStats: {},
          recentSessions: [],
        })
      );
      render(<StatisticsDashboard {...defaultProps} />);
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("60")).toBeInTheDocument();
    });

    it("shows recent sessions", () => {
      localStorage.setItem(
        STORAGE_STATS,
        JSON.stringify({
          totalSessions: 5,
          totalWordsTyped: 200,
          averageWpm: 40,
          bestWpm: 55,
          averageAccuracy: 90,
          bestAccuracy: 95,
          totalTimeTyped: 150,
          dailyStats: {},
          recentSessions: [
            {
              wpm: 45,
              accuracy: 92,
              wordsTyped: 50,
              timeTyped: 60,
              timestamp: Date.now(),
              lesson: "en_mid1",
            },
          ],
        })
      );
      render(<StatisticsDashboard {...defaultProps} />);
      expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    });
  });

  describe("export functionality", () => {
    it("shows export buttons when there is data", () => {
      localStorage.setItem(
        STORAGE_STATS,
        JSON.stringify({
          totalSessions: 1,
          totalWordsTyped: 50,
          averageWpm: 30,
          bestWpm: 30,
          averageAccuracy: 85,
          bestAccuracy: 85,
          totalTimeTyped: 60,
          dailyStats: {},
          recentSessions: [],
        })
      );
      render(<StatisticsDashboard {...defaultProps} />);
      expect(screen.getByText("JSON")).toBeInTheDocument();
      expect(screen.getByText("CSV")).toBeInTheDocument();
    });
  });

  describe("refresh", () => {
    it("reloads data when refresh is clicked", () => {
      render(<StatisticsDashboard {...defaultProps} />);
      fireEvent.click(screen.getByText("Refresh"));
      // Should not crash
      expect(screen.getByText("Statistics Dashboard")).toBeInTheDocument();
    });
  });
});

describe("statistics utility functions", () => {
  describe("loadStats", () => {
    it("returns default stats when empty", () => {
      const stats = loadStats();
      expect(stats.totalSessions).toBe(0);
      expect(stats.bestWpm).toBe(0);
      expect(stats.averageAccuracy).toBe(0);
    });
  });

  describe("recordSession", () => {
    it("records a session and updates stats", () => {
      recordSession(50, 95, 25, 30);
      const stats = loadStats();
      expect(stats.totalSessions).toBe(1);
      expect(stats.bestWpm).toBe(50);
      expect(stats.averageAccuracy).toBe(95);
    });

    it("accumulates multiple sessions", () => {
      recordSession(40, 90, 20, 30);
      recordSession(60, 95, 30, 30);
      const stats = loadStats();
      expect(stats.totalSessions).toBe(2);
      expect(stats.bestWpm).toBe(60);
      expect(stats.bestAccuracy).toBe(95);
    });
  });

  describe("updateStreak", () => {
    it("starts a new streak", () => {
      const streak = updateStreak();
      expect(streak.current).toBeGreaterThanOrEqual(1);
      expect(streak.best).toBeGreaterThanOrEqual(1);
    });

    it("continues existing streak from yesterday", () => {
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");
      localStorage.setItem(
        STORAGE_STREAK,
        JSON.stringify({ current: 3, best: 5, lastPracticed: yesterday })
      );
      const streak = updateStreak();
      expect(streak.current).toBe(4);
    });

    it("returns same streak if already practiced today", () => {
      const today = new Date().toLocaleDateString("en-CA");
      localStorage.setItem(
        STORAGE_STREAK,
        JSON.stringify({ current: 3, best: 5, lastPracticed: today })
      );
      const streak = updateStreak();
      expect(streak.current).toBe(3);
    });
  });

  describe("loadStreak", () => {
    it("returns default streak when empty", () => {
      const streak = loadStreak();
      expect(streak.current).toBe(0);
      expect(streak.best).toBe(0);
    });

    it("loads saved streak", () => {
      localStorage.setItem(
        STORAGE_STREAK,
        JSON.stringify({ current: 5, best: 10 })
      );
      const streak = loadStreak();
      expect(streak.current).toBe(5);
      expect(streak.best).toBe(10);
    });
  });
});
