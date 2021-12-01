import { IOStream, read, write } from "./IOStream";

type Instruction = "<" | ">" | "," | "." | "[" | "]" | "+" | "-";

type ProgramState = {
  dataPointer: number;
  memory: number[];
  jmpStack: number[];
  stdin: IOStream;
  stdout: IOStream;
};

const copyState = (state: ProgramState): ProgramState => ({
  ...state,
  memory: Object.assign([], state.memory),
});

const readMemory = (state: ProgramState) => state.memory[state.dataPointer];
const writeMemory = (state: ProgramState, data: number) =>
  (state.memory[state.dataPointer] = data);

export const consume = (
  instruction: Instruction,
  state: ProgramState
): ProgramState => {
  let newState = copyState(state);

  switch (instruction) {
    case ">":
      newState.dataPointer++;
      break;
    case "<":
      newState.dataPointer--;
      break;
    case "+":
      writeMemory(state, readMemory(state) + 1);
      break;
    case "-":
      writeMemory(state, readMemory(state) - 1);
      break;
    case ",":
      [newState.stdin, newState.memory[newState.dataPointer]] = read(
        newState.stdin
      );
      break;
    case ".":
      newState.stdout = write(newState.stdout, readMemory(newState));
      break;
    case "[":
      break;
    case "]":
      break;
  }

  return newState;
};
