import binarySearch from "binarysearch";

import { ReducerAction } from "../types";
import { ioReducer, IOStream } from "./IOStream";
import { List } from "./ImmutableList";

export type BrainfuckCoreAction =
  | ReducerAction<"next" | "continue">
  | ReducerAction<"breakpoint", number>
  | ReducerAction<"write", number[]>;
const instructionSet = new Set(["<", ">", ",", ".", "[", "]", "+", "-"]);
export type Instruction = "<" | ">" | "," | "." | "[" | "]" | "+" | "-";
export type BlockType = "none" | "io" | "breakpoint";

export type ProgramState = {
  programCounter: number;
  dataPointer: number;
  memory: List<number>;
  jmpStack: number[];
  program: Instruction[];

  breakpoints: number[];
  skipping: boolean;
  blocked: boolean;
  blockType: BlockType;

  stdin: IOStream;
  stdout: IOStream;
};

const copyState = (state: ProgramState): ProgramState => ({
  ...state,
  // TODO: Implement immutable dynamic list
  jmpStack: state.jmpStack.slice(0),
  breakpoints: state.breakpoints.slice(0),
});

const readMemory = (state: ProgramState) => state.memory.query(state.dataPointer);
const writeMemory = (state: ProgramState, data: number) =>
  (state.memory = state.memory.update(state.dataPointer, data));
const fetchInstruction = (state: ProgramState): Instruction => state.program[state.programCounter];

export const isEnded = (state: ProgramState) => state.programCounter === state.program.length;
export const isStarted = (state: ProgramState) => state.programCounter > 0 || state.blocked;

/**
 * Parse out the initial loop and ignore non-instruction characters
 */
export const parse = (program: string): Instruction[] => {
  let output: any = [];
  if (program.startsWith("[")) {
    let count = 1,
      index = 1;
    while (count > 0) {
      if (program[index] === "[") {
        count++;
      }
      if (program[index] === "]") {
        count--;
      }
      if (index > 30000) {
        return [];
      }
      index++;
    }
    program = program.slice(index + 1);
  }

  for (let s of program) {
    if (instructionSet.has(s)) {
      output.push(s);
    }
  }
  return output;
};

const next = (state: ProgramState, continuing: boolean = false): ProgramState => {
  if (isEnded(state) || state.blocked) return state;

  let newState = copyState(state);

  if (binarySearch(newState.breakpoints, newState.programCounter) >= 0 && !continuing) {
    // Breakpoint is triggered, it has a higher priority than the io block
    newState.blocked = true;
    newState.blockType = "breakpoint";
    return newState;
  }

  const instruction = fetchInstruction(newState);
  let overridePc = false;

  if (newState.skipping && instruction !== "]") {
    newState.programCounter++;
    return newState;
  }

  switch (instruction) {
    case ">":
      newState.dataPointer++;
      break;
    case "<":
      newState.dataPointer--;
      break;
    case "+":
      writeMemory(newState, readMemory(newState) + 1);
      break;
    case "-":
      writeMemory(newState, readMemory(newState) - 1);
      break;
    case ",":
      newState.stdin = ioReducer(newState.stdin, { type: "read", data: 1 });
      if (newState.stdin.pendingSize > 0) {
        // The stream is blocked, do not proceed
        // The only way to resolve a blocked stream is to dispatch `write`
        newState.blocked = true;
        newState.blockType = "io";
        return newState;
      }
      writeMemory(newState, newState.stdin.readBuffer[0]);
      if (newState.stdin.readBuffer[0] === undefined)
        throw new Error(`invalid write ${newState.stdin}`);
      break;
    case ".":
      newState.stdout = ioReducer(newState.stdout, { type: "write", data: readMemory(newState) });
      break;
    case "[":
      if (readMemory(newState) !== 0) {
        // We can jump back to this point
        newState.jmpStack.push(newState.programCounter);
      } else {
        // Skip the entire loop body until we reaches the corresponding ]
        newState.skipping = true;
      }
      break;
    case "]":
      if (readMemory(newState) === 0) {
        // When the data pointer becomes 0, reset the stack and continue
        newState.jmpStack.pop();
      } else {
        // Jump back to the top of the jmpStack
        newState.programCounter = newState.jmpStack[newState.jmpStack.length - 1] + 1;
        overridePc = true;
      }
      break;
  }

  if (!overridePc) newState.programCounter++;

  return newState;
};

/**
 * Write directly to the standard input stream
 */
const writeToStdin = (state: ProgramState, data: number[]) => {
  let newState = copyState(state);
  newState.stdin = ioReducer(newState.stdin, { type: "write", data: data });
  if (newState.stdin.pendingSize === 0 && newState.blockType === "io") {
    newState.blocked = false;
    newState.blockType = "none";
  }

  return newState;
};

const unblockBreakpoint = (state: ProgramState) => {
  let newState = copyState(state);
  if (newState.blocked && newState.blockType === "breakpoint") {
    newState.blocked = false;
    newState.blockType = "none";
  }

  return newState;
};

const breakpoint = (state: ProgramState, breakpoint: number) => {
  let newState = copyState(state);
  for (let i = 0; i <= newState.breakpoints.length; i++) {
    if (newState.breakpoints[i] === breakpoint) {
      newState.breakpoints = newState.breakpoints
        .slice(0, i)
        .concat(newState.breakpoints.slice(i + 1, newState.breakpoints.length));
      return newState;
    }

    if (i === newState.breakpoints.length || newState.breakpoints[i] > breakpoint) {
      newState.breakpoints = newState.breakpoints
        .slice(0, i)
        .concat([breakpoint], newState.breakpoints.slice(i, newState.breakpoints.length));
      return newState;
    }
  }

  return newState;
};

export const brainfuckReducer = (
  state: ProgramState,
  action: BrainfuckCoreAction
): ProgramState => {
  switch (action.type) {
    case "next":
      return next(state);
    case "write":
      return writeToStdin(state, action.data);
    case "continue":
      return next(unblockBreakpoint(state), true);
    case "breakpoint":
      return breakpoint(state, action.data);
  }
};
