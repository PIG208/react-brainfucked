import { BrainfuckAction } from "../hooks/useBrainfuck";

import "../css/ControlPanel.css";

import { ProgramState, isEnded, isStarted } from "../core/Interpreter";
import { testHelloWorld } from "../tests/Fixtures";

export type ControlPanelProps = {
  programState: ProgramState;
  setCode: (code: string) => void;
  dispatch: (action: BrainfuckAction) => void;
};

const ControlPanel = ({ programState, setCode, dispatch }: ControlPanelProps) => {
  return (
    <>
      <h2>
        Control Panel{" "}
        {programState.program.length === 0 && (
          <span className="note">(enter any bf program to get started)</span>
        )}
      </h2>
      <ul className="panel">
        <li>
          <button
            className="btn"
            onClick={() => dispatch({ type: "run" })}
            disabled={programState.program.length === 0}
          >
            Run
          </button>
        </li>
        <li>
          <button
            className="btn"
            onClick={() => dispatch({ type: "next" })}
            disabled={isEnded(programState) || programState.blocked}
          >
            {isStarted(programState)
              ? `Step${programState.blocked ? " (input required)" : ""}`
              : "Start"}
          </button>
        </li>
        <li>
          <button
            className="btn"
            onClick={() => dispatch({ type: "reset" })}
            disabled={programState.program.length === 0}
          >
            Reset
          </button>
        </li>
        <li>
          <button className="btn" onClick={() => setCode(testHelloWorld.raw)}>
            Hello World!
          </button>
        </li>
      </ul>
    </>
  );
};

export default ControlPanel;
