import { consume, parse } from "../models/Interpreter";
import { setupProgram } from "../models/Runner";
import { MockStream, testHelloWorld } from "./Fixtures";

test("interpreter parse", () => {
  expect(parse(testHelloWorld.raw)).toEqual(Array.from(testHelloWorld.parsed));
});

test("interpreter commands basic +-", () => {
  let state = setupProgram(["+", "+", "-"], MockStream, MockStream);

  state = consume(consume(state));
  expect(state.memory[0]).toEqual(2);

  state = consume(state);
  expect(state.memory[0]).toEqual(1);
});