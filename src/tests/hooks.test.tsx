import { render } from "@testing-library/react";
import { useEffect } from "react";

import { ASCIIsToString } from "../models/utils";

import { useBrainfuck } from "../hooks/useBrainfuck";

import { testHelloWorld } from "./Fixtures";

test("useBrainfuck basic", () => {
  const TestComponent = () => {
    let [brainfuck, dispatchBrainfuck] = useBrainfuck(testHelloWorld.raw);

    useEffect(() => {
      dispatchBrainfuck({ type: "reset" });
      for (let i = 0; i < 905; i++) dispatchBrainfuck({ type: "next" });
    }, [dispatchBrainfuck]);

    return <p data-testid="output">{ASCIIsToString(brainfuck.stdout.buffer)}</p>;
  };
  const wrapper = render(<TestComponent />);
  expect(wrapper.getByTestId("output").textContent).toEqual("Hello World!");
});
