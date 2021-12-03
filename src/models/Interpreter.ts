import { IOStream, read, write } from "./IOStream";

const instructionSet = new Set(["<", ">", ",", ".", "[", "]", "+", "-"]);
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
const writeMemory = (state: ProgramState, data: number) => (state.memory[state.dataPointer] = data);
const fetchInstruction = (state: ProgramState): Instruction => state.program[state.programCounter];

export const isEnded = (state: ProgramState) => state.programCounter === state.program.length;

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
        throw new Error("Unbalanced brackets");
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

export const consume = (state: ProgramState): ProgramState => {
  if (isEnded(state)) return state;

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
      writeMemory(newState, readMemory(newState) + 1);
      break;
    case "-":
      writeMemory(newState, readMemory(newState) - 1);
      break;
    case ",":
      newState.stdin = read(newState.stdin, 1);
      newState.memory[newState.dataPointer] = newState.stdin.readBuffer[0];
      if (newState.stdin.readBuffer[0] === undefined) throw new Error(`invalid write ${newState.stdin}`);
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
        newState.programCounter = newState.jmpStack[newState.jmpStack.length - 1] + 1;
        overridePc = true;
      }
      break;
  }

  if (!overridePc) newState.programCounter++;

  return newState;
};
