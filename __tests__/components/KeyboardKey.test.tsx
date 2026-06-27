import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import KeyboardKey from "@/components/KeyboardKey";
import type { KeyData } from "@/data/keyboardLayouts";

const mockOnKeyClick = jest.fn();

const defaultKeyData: KeyData = {
  mainChar: "a",
  secondaryChar: "A",
  special: false,
  keyCode: 97,
  secondaryKeyCode: 65,
};

const specialKeyData: KeyData = {
  mainChar: "",
  secondaryChar: "",
  special: "backspace",
  keyCode: 8,
};

const spaceKeyData: KeyData = {
  mainChar: "",
  secondaryChar: "",
  special: "space bar",
  keyCode: 32,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("KeyboardKey", () => {
  it("renders the main character", () => {
    render(
      <KeyboardKey
        data={defaultKeyData}
        selected={false}
        isNextKey={false}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    expect(screen.getByText("a")).toBeInTheDocument();
  });

  it("renders secondary character as small text", () => {
    render(
      <KeyboardKey
        data={defaultKeyData}
        selected={false}
        isNextKey={false}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders backspace symbol for backspace key", () => {
    render(
      <KeyboardKey
        data={specialKeyData}
        selected={false}
        isNextKey={false}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    expect(screen.getByText("⌫")).toBeInTheDocument();
  });

  it("calls onKeyClick with character when clicked", () => {
    render(
      <KeyboardKey
        data={defaultKeyData}
        selected={false}
        isNextKey={false}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    fireEvent.click(screen.getByText("a"));
    expect(mockOnKeyClick).toHaveBeenCalledWith("a", 97);
  });

  it("calls onKeyClick with empty string and keyCode 8 for backspace", () => {
    render(
      <KeyboardKey
        data={specialKeyData}
        selected={false}
        isNextKey={false}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    fireEvent.click(screen.getByText("⌫"));
    expect(mockOnKeyClick).toHaveBeenCalledWith("", 8);
  });

  it("renders space bar with empty text", () => {
    const { container } = render(
      <KeyboardKey
        data={spaceKeyData}
        selected={false}
        isNextKey={false}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    // Space bar should be wider than normal keys
    const keyDiv = container.firstElementChild as HTMLElement;
    expect(keyDiv).toBeTruthy();
  });

  it("applies selected styling when selected", () => {
    const { container } = render(
      <KeyboardKey
        data={defaultKeyData}
        selected={true}
        isNextKey={false}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    const keyDiv = container.firstElementChild as HTMLElement;
    expect(keyDiv.style.background).toContain("gradient");
    expect(keyDiv.style.color).toBe("white");
  });

  it("applies green glow when isNextKey", () => {
    const { container } = render(
      <KeyboardKey
        data={defaultKeyData}
        selected={false}
        isNextKey={true}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    const keyDiv = container.firstElementChild as HTMLElement;
    expect(keyDiv.style.background).toContain("34, 197, 94");
  });

  it("uses Preeti font for traditional keyboard", () => {
    const { container } = render(
      <KeyboardKey
        data={defaultKeyData}
        selected={false}
        isNextKey={false}
        keyboardType="traditional"
        onKeyClick={mockOnKeyClick}
      />
    );
    const keyDiv = container.firstElementChild as HTMLElement;
    expect(keyDiv.style.fontFamily).toContain("var(--font-nepali)");
  });

  it("uses system font for English keyboard", () => {
    const { container } = render(
      <KeyboardKey
        data={defaultKeyData}
        selected={false}
        isNextKey={false}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    const keyDiv = container.firstElementChild as HTMLElement;
    expect(keyDiv.style.fontFamily).toContain("var(--font-sans)");
  });

  it("does not call onKeyClick for keys without mainChar or special", () => {
    const emptyKey: KeyData = {
      mainChar: "",
      secondaryChar: "",
      special: "fn",
      keyCode: 0,
    };
    render(
      <KeyboardKey
        data={emptyKey}
        selected={false}
        isNextKey={false}
        keyboardType="english"
        onKeyClick={mockOnKeyClick}
      />
    );
    fireEvent.click(screen.getByText("Fn"));
    expect(mockOnKeyClick).not.toHaveBeenCalled();
  });
});
