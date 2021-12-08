import { MockStream } from "../tests/Fixtures";
import { IOStream } from "./IOStream";
import createList from "./ImmutableList";
import { ProgramState, Instruction, brainfuckReducer, isEnded, parse } from "./Interpreter";

export type RunResult = {
  finalState: ProgramState;
  numCycles: number;
  ended: boolean;
};

const MEMORY_SIZE = 30000;
export const MAX_PROGRAM_CYCLES = 2 << 16;

export const setupProgram = (
  program: Instruction[],
  stdin: IOStream,
  stdout: IOStream
): ProgramState => ({
  programCounter: 0,
  dataPointer: 0,
  memory: createList(Array(MEMORY_SIZE).fill(0)),
  jmpStack: [],
  program: program,

  breakpoints: [],
  skipping: false,
  blocked: false,
  blockType: "none",

  stdin: stdin,
  stdout: stdout,
});

export const setupTestProgram = (program: string, input: string = "") =>
  setupProgram(parse(program), MockStream(input), MockStream());

export const runCycles = (state: ProgramState, cycles: number): RunResult => {
  let cyclesCount = 0;
  while (!isEnded(state) && cyclesCount++ < cycles) {
    state = brainfuckReducer(state, { type: "next" });
  }
  return {
    finalState: state,
    numCycles: cyclesCount,
    ended: isEnded(state),
  };
};

export const run = (state: ProgramState): RunResult => {
  let cycles = 0;
  while (!isEnded(state) && ++cycles < MAX_PROGRAM_CYCLES) {
    state = brainfuckReducer(state, { type: "next" });
    if (state.blocked) break;
  }

  if (cycles === MAX_PROGRAM_CYCLES && !isEnded(state)) {
    console.error("Time limit exceed");
  }

  return {
    finalState: state,
    numCycles: cycles,
    ended: isEnded(state),
  };
};
