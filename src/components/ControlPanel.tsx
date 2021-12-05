import { BrainfuckAction } from "../hooks/useBrainfuck";

import "../css/ControlPanel.css";

import { ProgramState, isEnded, isStarted } from "../core/Interpreter";

export type ControlPanelProps = {
  programState: ProgramState;
  dispatch: (action: BrainfuckAction) => void;
};

const ControlPanel = ({ programState, dispatch }: ControlPanelProps) => {
  return (
    <ul className="panel">
      <li>
        <button className="btn" onClick={() => dispatch({ type: "run" })}>
          Run
        </button>
      </li>
      <li>
        <button
          className="btn"
          onClick={() => dispatch({ type: "next" })}
          disabled={isEnded(programState)}
        >
          {isStarted(programState) ? "Step" : "Start"}
        </button>
      </li>
      <li>
        <button className="btn" onClick={() => dispatch({ type: "reset" })}>
          Reset
        </button>
      </li>
    </ul>
  );
};

export default ControlPanel;
