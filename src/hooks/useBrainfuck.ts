import { useCallback, useEffect, useMemo, useState } from "react";

import { IOStream } from "../core/IOStream";
import { brainfuckReducer, isEnded, parse, ParseResult, ProgramState } from "../core/Interpreter";
import { MAX_PROGRAM_CYCLES, runCycles, setupProgram } from "../core/Runner";
import { stringToASCIIs } from "../core/utils";
import { ReducerAction, ReducerHookReturnType } from "../types";
import { useStream } from "./useStream";

export type BrainfuckAction =
  | ReducerAction<"load", string>
  | ReducerAction<"next" | "reset" | "reset-io" | "run" | "stop" | "continue">
  | ReducerAction<"write", string>
  | ReducerAction<"breakpoint", number>;
const DEFAULT_STREAM_SIZE = 2 << 10;
const setup = (parsed: ParseResult, input: IOStream, output: IOStream) =>
  setupProgram(parsed, input, output);

export const useBrainfuck = (
  initialProgram: string = ""
): ReducerHookReturnType<ProgramState, BrainfuckAction, boolean> => {
  const [program, setProgram] = useState(initialProgram);
  const parsedProgram = useMemo(() => {
    return parse(program);
  }, [program]);
  const [inputStream, inputStreamDispatch] = useStream(DEFAULT_STREAM_SIZE);
  const [outputStream, outputStreamDispatch] = useStream(DEFAULT_STREAM_SIZE);
  const [programState, setProgramState] = useState<ProgramState>(
    setup(parsedProgram, inputStream, outputStream)
  );
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setProgramState((programState) => {
      let state = brainfuckReducer(programState, {
        type: "refresh-io",
        data: { input: inputStream, output: outputStream },
      });
      return state;
    });
  }, [inputStream, outputStream]);

  useEffect(() => {
    let interval = setInterval(() => {
      if (!running) return;
      setCycle((cycle) => cycle + 1);
      setProgramState((programState) => runCycles(programState, 3).finalState);
    }, 0);

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (isEnded(programState) || programState.blocked || cycle > MAX_PROGRAM_CYCLES) {
      setRunning(false);
    }
  }, [cycle, programState]);

  const dispatch = useCallback(
    (action: BrainfuckAction) => {
      switch (action.type) {
        case "load":
          setRunning(false);
          setProgram(action.data);
          break;
        case "next":
          setProgramState((programState) => brainfuckReducer(programState, { type: "next" }));
          break;
        case "run":
          setRunning(true);
          break;
        case "stop":
          setRunning(false);
          break;
        case "reset":
          setRunning(false);
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
    [parsedProgram, inputStreamDispatch, outputStreamDispatch]
  );

  return [programState, dispatch, running];
};
