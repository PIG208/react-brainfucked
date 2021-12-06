import { useMemo, useState } from "react";

import { BrainfuckAction } from "../hooks/useBrainfuck";

import "../css/Console.css";

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
    <div>
      <p>Output</p>
      <div className="console">
        <div className="console-text">
          <pre>{ioBuffers.output}</pre>
        </div>
      </div>
      <p>Input</p>
      <div className="console with-input">
        <div className="console-text">
          <pre>{ioBuffers.input}</pre>
        </div>
        <div className="console-input">
          <input
            placeholder="This is the console"
            value={inputText}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                dispatch({ type: "write", data: inputText });
                setInputText("");
              }
            }}
            onChange={(e) => setInputText(e.target.value + "\n")}
          />
        </div>
      </div>
    </div>
  );
};

export default Console;
