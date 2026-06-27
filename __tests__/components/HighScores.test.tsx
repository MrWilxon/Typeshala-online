import React from "react";
import { render, screen } from "@testing-library/react";
import { HighScores } from "@/components/HighScores";

const mockScores = [
  { wpm: 50, accuracy: 95, setType: "midRow", source: "local" as const },
  { wpm: 60, accuracy: 98, setType: "topRow", source: "backend" as const },
  { wpm: 40, accuracy: 88, setType: "midRow", source: "local" as const },
];

describe("HighScores", () => {
  it("renders without crashing", () => {
    render(<HighScores scores={mockScores} theme="light" />);
    expect(screen.getByText("High Scores")).toBeInTheDocument();
  });

  it("renders all scores", () => {
    render(<HighScores scores={mockScores} theme="light" />);
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("displays empty state when no scores", () => {
    render(<HighScores scores={[]} theme="light" />);
    expect(screen.getByText(/No scores yet/)).toBeInTheDocument();
  });

  it("shows rank numbers", () => {
    render(<HighScores scores={mockScores} theme="light" />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("displays accuracy percentages", () => {
    render(<HighScores scores={mockScores} theme="light" />);
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("98%")).toBeInTheDocument();
    expect(screen.getByText("88%")).toBeInTheDocument();
  });

  it("displays source badges", () => {
    render(<HighScores scores={mockScores} theme="light" />);
    const localBadges = screen.getAllByText("Local");
    const serverBadges = screen.getAllByText("Server");
    expect(localBadges.length).toBe(2);
    expect(serverBadges.length).toBe(1);
  });

  it("displays setType labels", () => {
    render(<HighScores scores={mockScores} theme="light" />);
    const midRowBadges = screen.getAllByText("midRow");
    expect(midRowBadges.length).toBe(2);
    expect(screen.getByText("topRow")).toBeInTheDocument();
  });

  it("applies dark theme", () => {
    const { container } = render(<HighScores scores={mockScores} theme="dark" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders section with aria-label", () => {
    render(<HighScores scores={mockScores} theme="light" />);
    expect(screen.getByLabelText("High Scores")).toBeInTheDocument();
  });
});
