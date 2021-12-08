import { isEnded } from "../core/Interpreter";
import { MAX_PROGRAM_CYCLES, run, setupTestProgram } from "../core/Runner";

test("runner cycle count", () => {
  let state = setupTestProgram("+");

  let result = run(state);
  expect(result.numCycles).toEqual(1);

  let state2 = setupTestProgram("");
  result = run(state2);
  expect(result.numCycles).toEqual(0);
});

test("runner infinite loop", () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  let state = setupTestProgram("+[]");

  let result = run(state);
  expect(consoleSpy).toBeCalledWith("Time limit exceed");
  expect(result.numCycles).toEqual(MAX_PROGRAM_CYCLES);
});

test("runner quit when blocked", () => {
  let state = setupTestProgram(",");

  let result = run(state);
  expect(result.finalState.blocked).toBeTruthy();
  expect(isEnded(result.finalState)).toBeFalsy();
});
