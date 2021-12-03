import { useCallback, useMemo, useState } from "react";

import { initializeIOStream } from "../models/IOStream";
import { brainfuckReducer, Instruction, parse, ProgramState } from "../models/Interpreter";
import { setupProgram } from "../models/Runner";
import { stringToASCIIs } from "../models/utils";

import { ReducerAction, ReducerHookReturnType } from "../types";

type BrainfuckAction =
  | ReducerAction<"load", string>
  | ReducerAction<"next" | "reset">
  | ReducerAction<"write", string>;
const DEFAULT_STREAM_SIZE = 2 << 10;
const setup = (parsed: Instruction[]) =>
  setupProgram(
    parsed,
    initializeIOStream(DEFAULT_STREAM_SIZE),
    initializeIOStream(DEFAULT_STREAM_SIZE)
  );

export const useBrainfuck = (
  initialProgram: string = ""
): ReducerHookReturnType<ProgramState, BrainfuckAction> => {
  const [program, setProgram] = useState(initialProgram);
  const parsedProgram = useMemo(() => {
    return parse(program);
  }, [program]);
  const [programState, setProgramState] = useState<ProgramState>(setup(parsedProgram));

  const dispatch = useCallback(
    (action: BrainfuckAction) => {
      switch (action.type) {
        case "load":
          setProgram(action.data);
          break;
        case "next":
          setProgramState((programState) => brainfuckReducer(programState, { type: "next" }));
          break;
        case "reset":
          setProgramState(setup(parsedProgram));
          break;
        case "write":
          setProgramState((programState) =>
            brainfuckReducer(programState, { type: "write", data: stringToASCIIs(action.data) })
          );
          break;
      }
    },
    [setProgram, setProgramState, parsedProgram]
  );

  return [programState, dispatch];
};