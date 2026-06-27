/**
 * Header tests
 *
 * Note: The Header is built inline within TypingTutor.tsx.
 * These tests verify header elements rendered through TypingTutor.
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TypingTutor from "@/components/TypingTutor";

jest.mock("@/lib/audio", () => ({
  resumeAudioContext: jest.fn(),
  playKeySound: jest.fn(),
  playErrorSound: jest.fn(),
  playCompleteSound: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  saveScore: jest.fn(),
  getScores: jest.fn().mockResolvedValue([]),
}));

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("Header (via TypingTutor)", () => {
  it("renders app title", async () => {
    await act(async () => {
      render(<TypingTutor />);
    });
    expect(screen.getByText("Typeshala")).toBeInTheDocument();
  });

  it("renders brand character", async () => {
    await act(async () => {
      render(<TypingTutor />);
    });
    expect(screen.getAllByText("ट").length).toBeGreaterThan(0);
  });

  it("renders navigation tabs", async () => {
    await act(async () => {
      render(<TypingTutor />);
    });
    expect(screen.getByText("Lessons")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("renders language toggle buttons", async () => {
    await act(async () => {
      render(<TypingTutor />);
    });
    expect(screen.getByText("नेपाली")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("toggles pause/resume", async () => {
    await act(async () => {
      render(<TypingTutor />);
    });
    const pauseBtn = screen.getByTitle("Pause");
    fireEvent.click(pauseBtn);
    expect(screen.getByTitle("Resume")).toBeInTheDocument();
  });

  it("calls toggleTheme when theme button is clicked", async () => {
    await act(async () => {
      render(<TypingTutor />);
    });
    const themeButton = screen.getByTitle("Theme");
    fireEvent.click(themeButton);
    expect(localStorage.getItem("typeshala_theme")).toBeTruthy();
  });

  it("hides practice controls in test mode", async () => {
    await act(async () => {
      render(<TypingTutor />);
    });
    fireEvent.click(screen.getByText("Test"));
    expect(screen.queryByTitle("Pause")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Restart")).not.toBeInTheDocument();
  });
});
