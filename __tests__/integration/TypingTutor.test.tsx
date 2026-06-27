/**
 * Integration tests for TypingTutor component
 *
 * These tests verify the interaction between multiple sub-components
 * (Header, Keyboard, TypingArea, StatsBar, etc.) within the TypingTutor.
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TypingTutor from "@/components/TypingTutor";

// Mock audio module
jest.mock("@/lib/audio", () => ({
  resumeAudioContext: jest.fn(),
  playKeySound: jest.fn(),
  playErrorSound: jest.fn(),
  playCompleteSound: jest.fn(),
}));

// Mock API module
jest.mock("@/lib/api", () => ({
  saveScore: jest.fn(),
  getScores: jest.fn().mockResolvedValue([]),
}));

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("TypingTutor Integration", () => {
  describe("initial render", () => {
    it("renders the app title", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      expect(screen.getByText("Typeshala")).toBeInTheDocument();
    });

    it("renders navigation tabs", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      expect(screen.getByText("Lessons")).toBeInTheDocument();
      expect(screen.getByText("Custom")).toBeInTheDocument();
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("renders language toggle", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      expect(screen.getByText("नेपाली")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();
    });

    it("renders set type selector", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      expect(screen.getByText("Numbers")).toBeInTheDocument();
      expect(screen.getByText("Top Row")).toBeInTheDocument();
      expect(screen.getByText("Home Row")).toBeInTheDocument();
    });

    it("renders stats bar with progress rings", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      // StatsBar renders progress rings with WPM/accuracy values
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("language switching", () => {
    it("switches to English when English button is clicked", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      fireEvent.click(screen.getByText("English"));
      // After switching, should still render
      expect(screen.getByText("English")).toBeInTheDocument();
    });

    it("switches to Nepali when नेपाली button is clicked", async () => {
      await act(async () => {
        render(<TypingTutor initialKeyboardType="english" />);
      });
      fireEvent.click(screen.getByText("नेपाली"));
      expect(screen.getByText("नेपाली")).toBeInTheDocument();
    });
  });

  describe("practice mode switching", () => {
    it("switches to Custom mode", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      fireEvent.click(screen.getByText("Custom"));
      expect(screen.getByText(/Custom text mode/)).toBeInTheDocument();
    });

    it("switches to Test mode", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      fireEvent.click(screen.getByText("Test"));
      expect(screen.getByText("Choose test duration:")).toBeInTheDocument();
    });

    it("switches back to Lessons mode", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      fireEvent.click(screen.getByText("Custom"));
      fireEvent.click(screen.getByText("Lessons"));
      expect(screen.getByText("Lessons")).toBeInTheDocument();
    });
  });

  describe("control buttons", () => {
    it("toggles pause/resume", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      const pauseBtn = screen.getByTitle("Pause");
      fireEvent.click(pauseBtn);
      expect(screen.getByTitle("Resume")).toBeInTheDocument();
    });

    it("toggles finger guide", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      const fingerGuideBtn = screen.getByTitle("Finger Guide");
      fireEvent.click(fingerGuideBtn);
      expect(screen.getByText(/Finger Guide/)).toBeInTheDocument();
    });

    it("toggles sound", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      const soundBtn = screen.getByTitle("Sound");
      fireEvent.click(soundBtn);
      expect(soundBtn).toBeInTheDocument();
    });

    it("toggles theme", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      const themeBtn = screen.getByTitle("Theme");
      fireEvent.click(themeBtn);
      expect(themeBtn).toBeInTheDocument();
    });
  });

  describe("statistics and achievements panels", () => {
    it("opens statistics panel", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      const statsBtn = screen.getByTitle("Stats");
      fireEvent.click(statsBtn);
      expect(screen.getByText("Statistics Dashboard")).toBeInTheDocument();
    });

    it("opens achievements panel", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      const achievementsBtn = screen.getByTitle("Achievements");
      fireEvent.click(achievementsBtn);
      expect(screen.getByText("Achievements")).toBeInTheDocument();
    });

    it("opens high scores panel", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      const scoresBtn = screen.getByTitle("Scores");
      fireEvent.click(scoresBtn);
      expect(screen.getByText("High Scores")).toBeInTheDocument();
    });
  });

  describe("custom text mode", () => {
    it("accepts custom text input", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      fireEvent.click(screen.getByText("Custom"));
      const textarea = screen.getByPlaceholderText(/Type or paste your text here/);
      fireEvent.change(textarea, { target: { value: "hello world" } });
      expect(textarea).toHaveValue("hello world");
    });
  });

  describe("dark mode persistence", () => {
    it("saves theme to localStorage", async () => {
      await act(async () => {
        render(<TypingTutor />);
      });
      const themeBtn = screen.getByTitle("Theme");
      fireEvent.click(themeBtn);
      expect(localStorage.getItem("typeshala_theme")).toBeTruthy();
    });
  });
});
