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
      <div className="console">
        <div>{ioBuffers.output}</div>
      </div>
      <div className="console with-input">
        <div>{ioBuffers.input}</div>
        <div className="console-input">
          <input
            value={inputText}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                dispatch({ type: "write", data: inputText });
                setInputText("");
              }
            }}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Console;
