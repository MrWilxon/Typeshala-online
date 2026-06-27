import React from "react";
import { render, screen } from "@testing-library/react";
import { ToastNotifications } from "@/components/ToastNotifications";

const mockToasts = [
  {
    id: 1,
    achievement: {
      name: "First Lesson",
      description: "Complete your first lesson",
      icon: "🎯",
    },
  },
  {
    id: 2,
    achievement: {
      name: "Speed Demon",
      description: "Reach 60 WPM",
      icon: "⚡",
    },
  },
];

describe("ToastNotifications", () => {
  it("renders without crashing with empty toasts", () => {
    const { container } = render(<ToastNotifications toasts={[]} theme="light" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders toast notifications", () => {
    render(<ToastNotifications toasts={mockToasts} theme="light" />);
    expect(screen.getByText("First Lesson")).toBeInTheDocument();
    expect(screen.getByText("Speed Demon")).toBeInTheDocument();
  });

  it("displays achievement descriptions", () => {
    render(<ToastNotifications toasts={mockToasts} theme="light" />);
    expect(screen.getByText("Complete your first lesson")).toBeInTheDocument();
    expect(screen.getByText("Reach 60 WPM")).toBeInTheDocument();
  });

  it("displays Achievement Unlocked text", () => {
    render(<ToastNotifications toasts={mockToasts} theme="light" />);
    const unlockedTexts = screen.getAllByText("Achievement Unlocked!");
    expect(unlockedTexts.length).toBe(2);
  });

  it("renders achievement icons", () => {
    render(<ToastNotifications toasts={mockToasts} theme="light" />);
    expect(screen.getByText("🎯")).toBeInTheDocument();
    expect(screen.getByText("⚡")).toBeInTheDocument();
  });

  it("applies dark theme", () => {
    const { container } = render(<ToastNotifications toasts={mockToasts} theme="dark" />);
    expect(container.firstChild).toBeTruthy();
  });
});
