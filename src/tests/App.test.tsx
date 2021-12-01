import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../components/App";

test("title", () => {
  render(<App />);
  const title = screen.getByText("react-brainfucked");
  expect(title).toBeInTheDocument();
});
