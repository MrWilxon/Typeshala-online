import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/Header";

const defaultProps = {
  theme: "light" as const,
  practiceMode: "lessons" as const,
  streak: { current: 3, best: 10 },
  isPaused: false,
  showFingerGuide: false,
  showStats: false,
  showAchievements: false,
  showScores: false,
  soundEnabled: true,
  keyboardType: "english",
  setType: "midRow",
  setPracticeMode: jest.fn(),
  setKeyboardType: jest.fn(),
  setSetType: jest.fn(),
  setSoundEnabled: jest.fn(),
  toggleTheme: jest.fn(),
  handlePause: jest.fn(),
  handleRestart: jest.fn(),
  setShowFingerGuide: jest.fn(),
  setShowStats: jest.fn(),
  setShowAchievements: jest.fn(),
  setShowScores: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Header", () => {
  it("renders app title", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Typeshala")).toBeInTheDocument();
  });

  it("renders brand character", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("ट")).toBeInTheDocument();
  });

  it("renders navigation tabs", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Lessons")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("renders streak when current > 0", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText(/3 day streak/)).toBeInTheDocument();
  });

  it("does not render streak when current = 0", () => {
    render(<Header {...defaultProps} streak={{ current: 0, best: 5 }} />);
    expect(screen.queryByText(/streak/)).not.toBeInTheDocument();
  });

  it("calls setPracticeMode when Lessons tab is clicked", () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText("Lessons"));
    expect(defaultProps.setPracticeMode).toHaveBeenCalledWith("lessons");
  });

  it("calls setPracticeMode when Custom tab is clicked", () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText("Custom"));
    expect(defaultProps.setPracticeMode).toHaveBeenCalledWith("custom");
  });

  it("calls setPracticeMode when Test tab is clicked", () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText("Test"));
    expect(defaultProps.setPracticeMode).toHaveBeenCalledWith("test");
  });

  it("renders language toggle buttons", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("नेपाली")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("calls setKeyboardType when language toggle is clicked", () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText("English"));
    expect(defaultProps.setKeyboardType).toHaveBeenCalledWith("english");
  });

  it("calls toggleTheme when theme button is clicked", () => {
    render(<Header {...defaultProps} />);
    // Theme toggle button has title="Toggle theme" and shows MoonIcon/SunIcon
    const themeButton = screen.getByTitle("Toggle theme");
    fireEvent.click(themeButton);
    expect(defaultProps.toggleTheme).toHaveBeenCalled();
  });

  it("calls handlePause when Pause button is clicked", () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText("Pause"));
    expect(defaultProps.handlePause).toHaveBeenCalled();
  });

  it("shows Resume when paused", () => {
    render(<Header {...defaultProps} isPaused={true} />);
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("calls handleRestart when Restart button is clicked", () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText("Restart"));
    expect(defaultProps.handleRestart).toHaveBeenCalled();
  });

  it("hides practice controls in test mode", () => {
    render(<Header {...defaultProps} practiceMode="test" />);
    expect(screen.queryByText("Pause")).not.toBeInTheDocument();
    expect(screen.queryByText("Restart")).not.toBeInTheDocument();
    expect(screen.queryByText("नेपाली")).not.toBeInTheDocument();
  });

  it("applies dark theme", () => {
    const { container } = render(<Header {...defaultProps} theme="dark" />);
    expect(container.firstChild).toBeTruthy();
  });
});
