import { brainfuckReducer, parse } from "../core/Interpreter";
import { run, runCycles, setupProgram } from "../core/Runner";
import { ASCIIsToString, stringToASCIIs } from "../core/utils";
import { MockStream, nestedLoop, testHelloWorld } from "./Fixtures";

test("interpreter parse", () => {
  expect(parse(testHelloWorld.raw)).toEqual(testHelloWorld.parsed);
});

test("interpreter commands basic +-", () => {
  let state = setupProgram(["+", "+", "-"], MockStream(), MockStream());

  state = runCycles(state, 2).finalState;
  expect(state.memory.query(0)).toEqual(2);

  state = runCycles(state, 1).finalState;
  expect(state.memory.query(0)).toEqual(1);
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

test("interpreter commands advanced []", () => {
  let state = setupProgram(nestedLoop.parsed, MockStream("test"), MockStream());

  const result = run(state);
  expect(ASCIIsToString(result.finalState.stdout.buffer.slice(0, 4))).toEqual("test");
  expect(result.finalState.memory.slice(0, 5)).toEqual([0, 0, 116, 0, 12]);
  expect(result.numCycles).toEqual(122);
});

test("interpreter helloworld", () => {
  let state = setupProgram(testHelloWorld.parsed, MockStream(), MockStream());

  const result = run(state);
  expect(ASCIIsToString(result.finalState.stdout.buffer.slice(0, 12))).toEqual("Hello World!");
  expect(result.numCycles).toEqual(906);
});

test("interpreter immutability", () => {
  const state = setupProgram(["+", "+"], MockStream(), MockStream());

  expect(state.memory.query(0)).toEqual(0);
  expect(state.stdin.buffer.length).toEqual(0);

  const newState = brainfuckReducer(brainfuckReducer(state, { type: "next" }), {
    type: "write",
    data: [123],
  });
  expect(state.stdin.buffer.length).toEqual(0);
  expect(newState.stdin.buffer).toEqual([123]);
  expect(state.memory.query(0)).toEqual(0);
  expect(newState.memory.query(0)).toEqual(1);
});

test("intepreter blocking IO", () => {
  let state = setupProgram([","], MockStream(), MockStream());
  const initialPc = state.programCounter;

  state = brainfuckReducer(state, { type: "next" });
  expect(state.stdin.pendingSize).toEqual(1);
  expect(state.blocked).toBeTruthy();
  expect(state.programCounter).toEqual(initialPc);

  state = brainfuckReducer(state, { type: "next" });
  expect(state.stdin.pendingSize).toEqual(1);
  expect(state.blocked).toBeTruthy();
  expect(state.programCounter).toEqual(initialPc);

  state = brainfuckReducer(state, { type: "write", data: stringToASCIIs("k") });
  expect(state.blocked).toBeFalsy();

  state = brainfuckReducer(state, { type: "next" });
  expect(ASCIIsToString(state.stdin.readBuffer)).toEqual("k");
  expect(state.memory.query(state.dataPointer)).toEqual("k".charCodeAt(0));
});
