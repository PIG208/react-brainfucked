import { IOStream, read, write } from "./IOStream";

export type Instruction = "<" | ">" | "," | "." | "[" | "]" | "+" | "-";

export type ProgramState = {
  programCounter: number;
  dataPointer: number;
  memory: number[];
  jmpStack: number[];
  program: Instruction[];

  skipping: boolean;

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

export const consume = (state: ProgramState): ProgramState => {
  let newState = copyState(state);
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
        newState.programCounter =
          newState.jmpStack[newState.jmpStack.length - 1];
        overridePc = true;
      }
      break;
  }

  if (!overridePc) newState.programCounter++;

  return newState;
};
