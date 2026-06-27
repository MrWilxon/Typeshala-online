import React from "react";
import { render, screen } from "@testing-library/react";
import FingerGuide from "@/components/FingerGuide";

describe("FingerGuide", () => {
  it("renders without crashing", () => {
    const { container } = render(<FingerGuide keyboardType="english" theme="light" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders finger labels in the legend", () => {
    render(<FingerGuide keyboardType="english" theme="light" />);
    // Pinky appears twice (left + right hand)
    expect(screen.getAllByText("Pinky").length).toBe(2);
    expect(screen.getAllByText("Ring").length).toBe(2);
    expect(screen.getAllByText("Middle").length).toBe(2);
    expect(screen.getAllByText("Index").length).toBe(2);
    expect(screen.getByText("Thumb")).toBeInTheDocument();
  });

  it("renders SVG hand visualization", () => {
    const { container } = render(<FingerGuide keyboardType="english" theme="light" />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });

  it("applies dark theme", () => {
    const { container } = render(<FingerGuide keyboardType="english" theme="dark" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("works with traditional keyboard type", () => {
    const { container } = render(<FingerGuide keyboardType="traditional" theme="light" />);
    expect(container.firstChild).toBeTruthy();
  });
});
