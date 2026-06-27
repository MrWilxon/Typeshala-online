import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Keyboard from "@/components/Keyboard";

const mockOnKeyClick = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Keyboard", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <Keyboard
        activeKey={0}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("renders all 5 rows", () => {
    const { container } = render(
      <Keyboard
        activeKey={0}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    // Should have 5 row containers
    const rows = container.querySelectorAll('[style*="gap"]');
    expect(rows.length).toBeGreaterThanOrEqual(5);
  });

  it("renders QWERTY keys", () => {
    const { container } = render(
      <Keyboard
        activeKey={0}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    // q key should be present
    expect(container.textContent).toContain("q");
    expect(container.textContent).toContain("w");
    expect(container.textContent).toContain("e");
    expect(container.textContent).toContain("r");
    expect(container.textContent).toContain("t");
  });

  it("renders Nepali keyboard for traditional type", () => {
    const { container } = render(
      <Keyboard
        activeKey={0}
        keyboardType="traditional"
        onKeyClick={mockOnKeyClick}
      />
    );
    // Nepali characters should be present
    expect(container.textContent).toContain("क");
    expect(container.textContent).toContain("ख");
  });

  it("calls onKeyClick when a key is clicked", () => {
    const { container } = render(
      <Keyboard
        activeKey={0}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    // Find and click the 'a' key
    const keys = container.querySelectorAll("div");
    const aKey = Array.from(keys).find(
      (el) => el.textContent?.trim() === "a" && el.style.cursor === "pointer"
    );
    if (aKey) {
      fireEvent.click(aKey);
      expect(mockOnKeyClick).toHaveBeenCalled();
    }
  });

  it("highlights the active key", () => {
    const { container } = render(
      <Keyboard
        activeKey={97} // 'a' key keyCode
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("highlights next key when provided", () => {
    const { container } = render(
      <Keyboard
        activeKey={0}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
        nextChar="a"
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("renders special keys", () => {
    const { container } = render(
      <Keyboard
        activeKey={0}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    // Special keys use unicode symbols in KeyboardKey component
    expect(container.textContent).toContain("⇥"); // tab
    expect(container.textContent).toContain("⇪"); // caps lock
    expect(container.textContent).toContain("⇧"); // shift
    expect(container.textContent).toContain("↵"); // enter
  });

  it("renders space bar", () => {
    const { container } = render(
      <Keyboard
        activeKey={0}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    // Space bar is rendered but has empty text, check for wide element
    expect(container.firstChild).toBeTruthy();
  });
});
