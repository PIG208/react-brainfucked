import { BrainfuckAction } from "../hooks/useBrainfuck";

import "../css/ControlPanel.css";

import { ProgramState, isEnded, isStarted } from "../core/Interpreter";

export type ControlPanelProps = {
  programState: ProgramState;
  dispatch: (action: BrainfuckAction) => void;
};

const ControlPanel = ({ programState, dispatch }: ControlPanelProps) => {
  return (
    <>
      <p>
        Control Panel{" "}
        {programState.program.length === 0 && (
          <span className="note">(enter any bf program to get started)</span>
        )}
      </p>
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
      </ul>
    </>
  );
};

export default ControlPanel;
