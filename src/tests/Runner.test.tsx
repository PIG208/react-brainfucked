import { MAX_PROGRAM_CYCLES, run, setupProgram } from "../core/Runner";
import { MockStream } from "./Fixtures";

test("runner cycle count", () => {
  let state = setupProgram(["+"], MockStream(), MockStream());

  let result = run(state);
  expect(result.numCycles).toEqual(1);

  let state2 = setupProgram([], MockStream(), MockStream());
  result = run(state2);
  expect(result.numCycles).toEqual(0);
});

test("runner infinite loop", () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  let state = setupProgram(["+", "[", "]"], MockStream(), MockStream());

  let result = run(state);
  expect(consoleSpy).toBeCalledWith("Time limit exceed");
  expect(result.numCycles).toEqual(MAX_PROGRAM_CYCLES);
});

test("runner wait forever for input", () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  let state = setupProgram([","], MockStream(), MockStream());

  let result = run(state);
  expect(consoleSpy).toBeCalledWith("Time limit exceed");
  expect(result.finalState.blocked).toBeTruthy();
  expect(result.numCycles).toEqual(MAX_PROGRAM_CYCLES);
});
