import React from "react";
import { render, screen } from "@testing-library/react";
import StatsBar from "@/components/StatsBar";

describe("StatsBar", () => {
  const defaultProps = {
    wpm: 45,
    accuracy: 92,
    elapsed: 30,
    theme: "light" as const,
  };

  it("renders without crashing", () => {
    const { container } = render(<StatsBar {...defaultProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("displays WPM value inside progress ring", () => {
    render(<StatsBar {...defaultProps} />);
    expect(screen.getByText("45")).toBeInTheDocument();
  });

  it("displays accuracy value", () => {
    render(<StatsBar {...defaultProps} />);
    expect(screen.getByText("92")).toBeInTheDocument();
  });

  it("displays elapsed time formatted as mm:ss", () => {
    render(<StatsBar {...defaultProps} />);
    expect(screen.getByText("0:30")).toBeInTheDocument();
  });

  it("formats minutes:seconds correctly for large values", () => {
    render(<StatsBar {...defaultProps} elapsed={125} />);
    expect(screen.getByText("2:05")).toBeInTheDocument();
  });

  it("applies dark theme styles", () => {
    const { container } = render(<StatsBar {...defaultProps} theme="dark" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("handles zero values", () => {
    render(<StatsBar wpm={0} accuracy={0} elapsed={0} theme="light" />);
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it("renders three stat cards", () => {
    const { container } = render(<StatsBar {...defaultProps} />);
    // Should have 3 card containers
    const cards = container.querySelectorAll("[style*='flex: 1']");
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });
});
