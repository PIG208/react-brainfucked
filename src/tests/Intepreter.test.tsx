import { brainfuckReducer, isEnded, parse } from "../core/Interpreter";
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

test("interpreter breakpoints toggle", () => {
  let state = setupProgram([","], MockStream(), MockStream());

  state = brainfuckReducer(state, { type: "breakpoint", data: 2 });
  expect(state.breakpoints).toEqual([2]);

  state = brainfuckReducer(state, { type: "breakpoint", data: 4 });
  state = brainfuckReducer(state, { type: "breakpoint", data: 5 });
  state = brainfuckReducer(state, { type: "breakpoint", data: 7 });
  state = brainfuckReducer(state, { type: "breakpoint", data: 1 });
  expect(state.breakpoints).toEqual([1, 2, 4, 5, 7]);

  state = brainfuckReducer(state, { type: "breakpoint", data: 3 });
  state = brainfuckReducer(state, { type: "breakpoint", data: 2 });
  expect(state.breakpoints).toEqual([1, 3, 4, 5, 7]);
});

test("intepreter breakpoints trigger", () => {
  let state = setupProgram(["+", "+", "+", "[", "-", "]"], MockStream("a"), MockStream());

  state = brainfuckReducer(state, { type: "breakpoint", data: 4 });
  state = runCycles(state, 5).finalState;

  expect(state.blocked).toBeTruthy();
  expect(state.blockType).toEqual("breakpoint");

  state = brainfuckReducer(state, { type: "continue" });
  expect(state.blocked).toBeFalsy();
  expect(state.blockType).toEqual("none");

  state = runCycles(state, 100).finalState;
  expect(state.blocked).toBeTruthy();

  state = brainfuckReducer(state, { type: "continue" });
  expect(isEnded(runCycles(state, 100).finalState)).toBeFalsy();

  // toggle off the breakpoint
  state = run(brainfuckReducer(state, { type: "breakpoint", data: 4 })).finalState;
  expect(isEnded(state)).toBeTruthy();
});

test("intepreter breakpoints trigger multiple", () => {
  let state = setupProgram(["+", "+", "+", "+"], MockStream("a"), MockStream());

  state = brainfuckReducer(state, { type: "breakpoint", data: 1 });
  state = brainfuckReducer(state, { type: "breakpoint", data: 2 });
  state = brainfuckReducer(state, { type: "breakpoint", data: 0 });
  state = brainfuckReducer(state, { type: "breakpoint", data: 3 });

  state = brainfuckReducer(state, { type: "next" });

  for (let i = 0; i < 4; i++) {
    expect(state.blocked).toBeTruthy();
    expect(state.blockType).toEqual("breakpoint");

    state = brainfuckReducer(state, { type: "continue" });
    expect(state.blocked).toBeFalsy();
    expect(state.blockType).toEqual("none");
    state = brainfuckReducer(state, { type: "next" });
  }

  expect(isEnded(state)).toBeTruthy();
});
