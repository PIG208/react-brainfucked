import { useCallback, useEffect, useMemo, useState } from "react";

import { IOStream } from "../core/IOStream";
import { brainfuckReducer, parse, ParseResult, ProgramState } from "../core/Interpreter";
import { run, setupProgram } from "../core/Runner";
import { stringToASCIIs } from "../core/utils";
import { ReducerAction, ReducerHookReturnType } from "../types";
import { useStream } from "./useStream";

export type BrainfuckAction =
  | ReducerAction<"load", string>
  | ReducerAction<"next" | "reset" | "reset-io" | "run" | "continue">
  | ReducerAction<"write", string>
  | ReducerAction<"breakpoint", number>;
const DEFAULT_STREAM_SIZE = 2 << 10;
const setup = (parsed: ParseResult, input: IOStream, output: IOStream) =>
  setupProgram(parsed, input, output);

export const useBrainfuck = (
  initialProgram: string = ""
): ReducerHookReturnType<ProgramState, BrainfuckAction> => {
  const [program, setProgram] = useState(initialProgram);
  const parsedProgram = useMemo(() => {
    return parse(program);
  }, [program]);
  const [inputStream, inputStreamDispatch] = useStream(DEFAULT_STREAM_SIZE);
  const [outputStream, outputStreamDispatch] = useStream(DEFAULT_STREAM_SIZE);
  const [programState, setProgramState] = useState<ProgramState>(
    setup(parsedProgram, inputStream, outputStream)
  );

  useEffect(() => {
    setProgramState((programState) =>
      brainfuckReducer(programState, {
        type: "refresh-io",
        data: { input: inputStream, output: outputStream },
      })
    );
  }, [inputStream, outputStream]);

  const dispatch = useCallback(
    (action: BrainfuckAction) => {
      switch (action.type) {
        case "load":
          setProgram(action.data);
          break;
        case "next":
          setProgramState((programState) => brainfuckReducer(programState, { type: "next" }));
          break;
        case "run":
          setProgramState((programState) => run(programState).finalState);
          break;
        case "reset":
          setProgramState((programState) =>
            setup(parsedProgram, programState.stdin, programState.stdout)
          );
          break;
        case "reset-io":
          inputStreamDispatch({ type: "reset" });
          outputStreamDispatch({ type: "reset" });
          break;
        case "write":
          setProgramState((programState) =>
            brainfuckReducer(programState, { type: "write", data: stringToASCIIs(action.data) })
          );
          break;
        case "breakpoint":
          setProgramState((programState) =>
            brainfuckReducer(programState, { type: "breakpoint", data: action.data })
          );
          break;
        case "continue":
          setProgramState((programState) => brainfuckReducer(programState, { type: "continue" }));
          break;
      }
    },
    [setProgram, setProgramState, parsedProgram, inputStreamDispatch, outputStreamDispatch]
  );

  return [programState, dispatch];
};
