import { consume, parse } from "../models/Interpreter";
import { run, setupProgram } from "../models/Runner";
import { ASCIIsToString } from "../models/utils";
import { MockStream, testHelloWorld } from "./Fixtures";

test("interpreter parse", () => {
  expect(parse(testHelloWorld.raw)).toEqual(Array.from(testHelloWorld.parsed));
});

test("interpreter commands basic +-", () => {
  let state = setupProgram(["+", "+", "-"], MockStream(), MockStream());

  state = consume(consume(state));
  expect(state.memory[0]).toEqual(2);

  state = consume(state);
  expect(state.memory[0]).toEqual(1);
});

test("interpreter commands basic <>", () => {
  let state = setupProgram(
    ["+", ">", "+", "+", ">", ">", "+", "<", "<", "<", "-"],
    MockStream(),
    MockStream()
  );

  state = run(state).finalState;
  expect(state.memory.slice(0, 4)).toEqual([0, 2, 0, 1]);
});

test("interpreter commands basic ,.", () => {
  let state = setupProgram([",", "."], MockStream("test"), MockStream());

  state = run(state).finalState;
  expect(ASCIIsToString(state.stdout.buffer.slice(0, 1))).toEqual("t");
});

test("interpreter commands basic []", () => {
  let state = setupProgram(
    [">", "+", "+", "+", "+", "[", ">", ",", ".", "<", "-", "]"],
    MockStream("test"),
    MockStream()
  );

  const result = run(state);
  expect(ASCIIsToString(result.finalState.stdout.buffer.slice(0, 4))).toEqual("test");
});
