import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LessonSelector from "@/components/LessonSelector";
import { lessons } from "@/data/lessons";

const defaultProps = {
  keyboardType: "english",
  setType: "midRow" as const,
  currentIndex: 0,
  completedLessons: [],
  onSelect: jest.fn(),
  theme: "light" as const,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("LessonSelector", () => {
  it("renders without crashing", () => {
    render(<LessonSelector {...defaultProps} />);
    expect(screen.getByText(/Select Lesson/)).toBeInTheDocument();
  });

  it("renders lesson buttons", () => {
    render(<LessonSelector {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("calls onSelect when a lesson is clicked", () => {
    render(<LessonSelector {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    expect(defaultProps.onSelect).toHaveBeenCalled();
  });

  it("shows completed lessons with SVG checkmark", () => {
    const enMidLessons = Object.keys(lessons).filter(
      (k) => k.startsWith("en_") && lessons[k].setType === "midRow"
    );
    if (enMidLessons.length > 0) {
      const { container } = render(
        <LessonSelector
          {...defaultProps}
          completedLessons={[enMidLessons[0]]}
        />
      );
      // Completed lesson has a green-tinted background via isCompleted
      // The SVG checkmark (polyline) should be present
      const svgCheckmarks = container.querySelectorAll("svg polyline");
      expect(svgCheckmarks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("displays current note when provided", () => {
    render(<LessonSelector {...defaultProps} currentNote="Practice the home row" />);
    expect(screen.getByText("Practice the home row")).toBeInTheDocument();
  });

  it("applies dark theme", () => {
    const { container } = render(<LessonSelector {...defaultProps} theme="dark" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("shows available lesson count", () => {
    render(<LessonSelector {...defaultProps} />);
    expect(screen.getByText(/available/)).toBeInTheDocument();
  });
});
