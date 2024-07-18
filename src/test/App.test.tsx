import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("test", () => {
  it("should be App", () => {
    render(<App />);
    expect(screen.getByRole("paragraph")).toHaveTextContent(/App/i);
  });
});
