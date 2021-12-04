import { useMemo, useState } from "react";

import { BrainfuckAction } from "../hooks/useBrainfuck";

import { ProgramState } from "../core/Interpreter";
import { ASCIIsToString } from "../core/utils";

export type ConsoleProps = {
  programState: ProgramState;
  dispatch: (action: BrainfuckAction) => void;
};

const Console = ({ programState, dispatch }: ConsoleProps) => {
  const [inputText, setInputText] = useState("");
  const ioBuffers = useMemo(
    () => ({
      output: ASCIIsToString(programState.stdout.buffer),
      input: ASCIIsToString(programState.stdin.buffer),
    }),
    [programState]
  );

  return (
    <>
      <div>
        <h1>Output</h1>
        {ioBuffers.output}
      </div>
      <div>
        <h1>Input</h1>
        {ioBuffers.input}
      </div>
      <input value={inputText} onChange={(e) => setInputText(e.target.value)} />
      <button onClick={() => dispatch({ type: "write", data: inputText })}>Enter</button>
    </>
  );
};

export default Console;
