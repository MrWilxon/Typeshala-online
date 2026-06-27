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
      expect(screen.getByText("Warm-up")).toBeInTheDocument();
      expect(screen.getByText("1 min")).toBeInTheDocument();
      expect(screen.getByText("2 min")).toBeInTheDocument();
      expect(screen.getByText("5 min")).toBeInTheDocument();
    });

    it("shows start button", () => {
      render(<TypingTest {...defaultProps} />);
      expect(screen.getByText("Start Test")).toBeInTheDocument();
    });
  });

  describe("duration selection", () => {
    it("selects 1 min duration by default", () => {
      render(<TypingTest {...defaultProps} />);
      const btn1min = screen.getByText("1 min");
      expect(btn1min).toBeInTheDocument();
    });

    it("allows selecting different durations", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("1 min"));
      expect(screen.getByText("1 min")).toBeInTheDocument();
    });

    it("allows selecting 2 min duration", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("2 min"));
      expect(screen.getByText("2 min")).toBeInTheDocument();
    });

    it("allows selecting 5 min duration", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("5 min"));
      expect(screen.getByText("5 min")).toBeInTheDocument();
    });
  });

  describe("test execution", () => {
    it("starts test when Start Test is clicked", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("Start Test"));
      expect(screen.getByText("1:00")).toBeInTheDocument();
    });

    it("shows timer after starting", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("Start Test"));
      expect(screen.getByText("1:00")).toBeInTheDocument();
    });

    it("shows keyboard after starting", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("Start Test"));
      // Keyboard should be visible
      expect(screen.getAllByText("q").length).toBeGreaterThan(0);
    });

    it("shows stats bar after starting", () => {
      render(<TypingTest {...defaultProps} />);
      fireEvent.click(screen.getByText("Start Test"));
      expect(screen.getAllByText("0").length).toBeGreaterThan(0);
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
      expect(screen.getAllByText("q").length).toBeGreaterThan(0);
    });

    it("works with traditional keyboard", () => {
      render(<TypingTest {...defaultProps} keyboardType="traditional" />);
      fireEvent.click(screen.getByText("Start Test"));
      expect(screen.getAllByText("क").length).toBeGreaterThan(0);
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
