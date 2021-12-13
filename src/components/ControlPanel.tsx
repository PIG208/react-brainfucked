import { BrainfuckAction } from "../hooks/useBrainfuck";

import "../css/ControlPanel.css";

import { ProgramState, isEnded, isStarted, isPaused } from "../core/Interpreter";
import { testHelloWorld } from "../tests/Fixtures";

export type ControlPanelProps = {
  running: boolean;
  programState: ProgramState;
  setCode: (code: string) => void;
  dispatch: (action: BrainfuckAction) => void;
};

const ControlPanel = ({ programState, setCode, dispatch, running }: ControlPanelProps) => (
  <div>
    <h2>
      Control Panel{" "}
      {programState.program.length === 0 && (
        <span className="note">(enter any bf program to get started)</span>
      )}
    </h2>
    <p>
      Status:{" "}
      {!isStarted(programState)
        ? "not started"
        : isEnded(programState)
        ? "ended"
        : programState.blocked
        ? `${programState.blockType === "error" ? "error" : "blocked"}${
            programState.blockType === "breakpoint"
              ? " (breakpoint)"
              : programState.blockType === "io"
              ? " (input required)"
              : programState.blockType === "error"
              ? ` (${programState.errorCode})`
              : ""
          }`
        : "running"}
    </p>
    <ul className="panel">
      <li>
        <button
          className="btn"
          onClick={() => {
            if (running) {
              dispatch({ type: "stop" });
              return;
            }

            if (isPaused(programState)) dispatch({ type: "continue" });
            dispatch({ type: "run" });
          }}
          disabled={
            programState.program.length === 0 ||
            isEnded(programState) ||
            (programState.blocked && !isPaused(programState))
          }
        >
          {!isStarted(programState) ? "Run" : running ? "Stop" : "Continue"}
        </button>
      </li>
      <li>
        <button
          className="btn"
          onClick={() => {
            if (isPaused(programState)) dispatch({ type: "continue" });
            else dispatch({ type: "next" });
          }}
          disabled={
            isEnded(programState) || running || (programState.blocked && !isPaused(programState))
          }
        >
          {!isStarted(programState) ? "Start" : "Step"}
        </button>
      </li>
      <li>
        <button
          className="btn"
          onClick={() => {
            if (!isStarted(programState)) {
              dispatch({ type: "reset-io" });
            }
            dispatch({ type: "reset" });
          }}
          disabled={programState.program.length === 0}
        >
          Reset{" "}
          {!isStarted(programState) &&
          (programState.stdin.pointer > 0 || programState.stdout.pointer > 0)
            ? "IO"
            : ""}
        </button>
      </li>
      <li>
        <button className="btn" onClick={() => setCode(testHelloWorld.raw)}>
          Hello World!
        </button>
      </li>
    </ul>
  </div>
);

export default ControlPanel;
