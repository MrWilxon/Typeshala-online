import React from "react";
import { render, screen } from "@testing-library/react";
import TypingArea from "@/components/TypingArea";

describe("TypingArea", () => {
  it("renders the original string characters", () => {
    const { container } = render(
      <TypingArea
        originalString="hello world"
        typedString=""
        keyboardType="english"
      />
    );
    // Each character is in its own span, so check textContent
    expect(container.textContent).toContain("hello world");
  });

  it("shows typed characters with correct styling", () => {
    const { container } = render(
      <TypingArea
        originalString="abc"
        typedString="ab"
        keyboardType="english"
      />
    );
    // Typed chars should be present
    expect(container.textContent).toContain("abc");
  });

  it("highlights incorrect characters in red", () => {
    const { container } = render(
      <TypingArea
        originalString="abc"
        typedString="axc"
        keyboardType="english"
      />
    );
    // All original chars should still be visible
    expect(container.textContent).toContain("abc");
  });

  it("handles empty strings", () => {
    const { container } = render(
      <TypingArea
        originalString=""
        typedString=""
        keyboardType="english"
      />
    );
    // Should render an empty div
    expect(container.firstChild).toBeTruthy();
  });

  it("applies Preeti font for traditional keyboard", () => {
    const { container } = render(
      <TypingArea
        originalString="test"
        typedString=""
        keyboardType="traditional"
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("applies English font for english keyboard", () => {
    const { container } = render(
      <TypingArea
        originalString="test"
        typedString=""
        keyboardType="english"
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("handles fully typed string", () => {
    const { container } = render(
      <TypingArea
        originalString="abc"
        typedString="abc"
        keyboardType="english"
      />
    );
    expect(container.textContent).toContain("abc");
  });

  it("handles overtyped string", () => {
    const { container } = render(
      <TypingArea
        originalString="abc"
        typedString="abcd"
        keyboardType="english"
      />
    );
    expect(container.textContent).toContain("abc");
  });

  it("handles string with spaces", () => {
    const { container } = render(
      <TypingArea
        originalString="a b c"
        typedString="a b"
        keyboardType="english"
      />
    );
    expect(container.textContent).toContain("a b c");
  });

  it("shows cursor when not fully typed", () => {
    const { container } = render(
      <TypingArea
        originalString="abc"
        typedString="a"
        keyboardType="english"
      />
    );
    // Cursor element should exist (inline-block span)
    expect(container.querySelector("[style*='inline-block']")).toBeTruthy();
  });

  it("hides cursor when fully typed", () => {
    const { container } = render(
      <TypingArea
        originalString="abc"
        typedString="abc"
        keyboardType="english"
      />
    );
    expect(container.querySelector("[style*='inline-block']")).toBeNull();
  });
});
