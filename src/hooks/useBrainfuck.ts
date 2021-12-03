import { useEffect, useMemo, useState } from "react";

import { initializeIOStream } from "../models/IOStream";
import { brainfuckReducer, parse, ProgramState } from "../models/Interpreter";
import { setupProgram } from "../models/Runner";
import { stringToASCIIs } from "../models/utils";

import { ReducerAction, ReducerHookReturnType } from "../types";

type BrainfuckAction =
  | ReducerAction<"load", string>
  | ReducerAction<"next" | "reset">
  | ReducerAction<"write", string>;
const DEFAULT_STREAM_SIZE = 2 << 10;

export const useBrainfuck = (
  initialProgram: string = "",
  streamSize = DEFAULT_STREAM_SIZE
): ReducerHookReturnType<ProgramState, BrainfuckAction> => {
  const [program, setProgram] = useState(initialProgram);
  const parsedProgram = useMemo(() => {
    return parse(program);
  }, [program]);
  const streamIn = initializeIOStream(streamSize);
  const streamOut = initializeIOStream(streamSize);
  const [programState, setProgramState] = useState<ProgramState>(
    setupProgram(parsedProgram, streamIn, streamOut)
  );

  // Whenever the program is changed
  // recompile the script and restart the program
  useEffect(() => {
    setProgramState(setupProgram(parsedProgram, streamIn, streamOut));
  }, [parsedProgram, streamIn, streamOut]);

  const dispatch = (action: BrainfuckAction) => {
    switch (action.type) {
      case "load":
        setProgram(action.data);
        break;
      case "next":
        setProgramState(brainfuckReducer(programState, { type: "next" }));
        break;
      case "reset":
        setProgramState(setupProgram(parsedProgram, streamIn, streamOut));
        break;
      case "write":
        setProgramState(
          brainfuckReducer(programState, { type: "write", data: stringToASCIIs(action.data) })
        );
        break;
    }
  };

  return [programState, dispatch];
};
