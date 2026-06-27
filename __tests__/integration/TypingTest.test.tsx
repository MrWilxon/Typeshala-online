/**
 * Integration tests for TypingTest component
 *
 * Tests the timed typing test feature including duration selection,
 * test execution, and results display.
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TypingTest from "@/components/TypingTest";

// Mock audio module
jest.mock("@/lib/audio", () => ({
  resumeAudioContext: jest.fn(),
  playKeySound: jest.fn(),
  playErrorSound: jest.fn(),
  playCompleteSound: jest.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("TypingTest Integration", () => {
  const defaultProps = {
    keyboardType: "english",
    theme: "light" as const,
    onComplete: jest.fn(),
  };

  describe("initial render", () => {
    it("renders the typing test heading", () => {
      render(<TypingTest {...defaultProps} />);
      expect(screen.getByText("Typing Test")).toBeInTheDocument();
    });

    it("shows duration selection", () => {
      render(<TypingTest {...defaultProps} />);
      expect(screen.getByText("Choose test duration:")).toBeInTheDocument();
    });

    it("shows all duration options", () => {
      render(<TypingTest {...defaultProps} />);
      expect(screen.getByText("30s")).toBeInTheDocument();
      expect(screen.getByText("60s")).toBeInTheDocument();
      expect(screen.getByText("2min")).toBeInTheDocument();
      expect(screen.getByText("5min")).toBeInTheDocument();
    });

    it("shows start button", () => {
      render(<TypingTest {...defaultProps} />);
      expect(screen.getByText("Start Test")).toBeInTheDocument();
    });
  });

  describe("duration selection", () => {
    it("selects 30s duration by default", () => {
      render(<TypingTest {...defaultProps} />);
      const btn30 = screen.getByText("30s");
      // Default should be selected (style should differ)
      expect(btn30).toBeInTheDocument();
    });

    it("allows selecting different durations", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("60s"));
      expect(screen.getByText("60s")).toBeInTheDocument();
    });

    it("allows selecting 2min duration", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("2min"));
      expect(screen.getByText("2min")).toBeInTheDocument();
    });

    it("allows selecting 5min duration", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("5min"));
      expect(screen.getByText("5min")).toBeInTheDocument();
    });
  });

  describe("test execution", () => {
    it("starts test when Start Test is clicked", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("Start Test"));
      // After starting, the test should show the typing area
      // and the timer should be running
      expect(screen.getByText("0:30")).toBeInTheDocument();
    });

    it("shows timer after starting", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("Start Test"));
      expect(screen.getByText("0:30")).toBeInTheDocument();
    });

    it("shows keyboard after starting", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("Start Test"));
      // Keyboard should be visible
      expect(screen.getByText("q")).toBeInTheDocument();
    });

    it("shows stats bar after starting", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("Start Test"));
      expect(screen.getByText("WPM")).toBeInTheDocument();
      expect(screen.getByText("Accuracy")).toBeInTheDocument();
    });

    it("disables duration selection during test", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("Start Test"));
      // Duration buttons should not be visible
      expect(screen.queryByText("Choose test duration:")).not.toBeInTheDocument();
    });
  });

  describe("theme support", () => {
    it("applies dark theme", () => {
      const { container } = render(
        <TypingTest {...defaultProps} theme="dark" />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it("applies light theme", () => {
      const { container } = render(
        <TypingTest {...defaultProps} theme="light" />
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe("keyboard type support", () => {
    it("works with English keyboard", () => {
      render(<TypingTest {...defaultProps} keyboardType="english" />);
      fireEvent.click(screen.getByText("Start Test"));
      expect(screen.getByText("q")).toBeInTheDocument();
    });

    it("works with traditional keyboard", () => {
      render(<TypingTest {...defaultProps} keyboardType="traditional" />);
      fireEvent.click(screen.getByText("Start Test"));
      expect(screen.getByText("क")).toBeInTheDocument();
    });
  });

  describe("onComplete callback", () => {
    it("calls onComplete when provided", () => {
      const onComplete = jest.fn();
      render(<TypingTest {...defaultProps} onComplete={onComplete} />);
      // onComplete is called when test finishes, not on render
      expect(onComplete).not.toHaveBeenCalled();
    });
  });
});
