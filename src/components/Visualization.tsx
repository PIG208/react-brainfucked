import { useMemo } from "react";

import { BrainfuckAction } from "../hooks/useBrainfuck";

import "../css/Visualization.css";

import { isStarted, ProgramState } from "../core/Interpreter";

export type VisualizationProps = {
  programState: ProgramState;
  dispatch: (action: BrainfuckAction) => void;
};

const Visualization = ({ programState, dispatch }: VisualizationProps) => {
  const isCurrentPc = (pc: number) =>
    (!programState.blocked &&
      (pc === programState.programCounter - 1 ||
        (pc === 0 && programState.programCounter === 0))) ||
    (programState.blocked && pc === programState.programCounter);
  const breakpoints = useMemo(() => {
    let currentBreakpointIndex = 0;
    return programState.program.map((_, index) => {
      if (index === programState.breakpoints[currentBreakpointIndex]) {
        currentBreakpointIndex++;
        return true;
      }
      return false;
    });
  }, [programState.program, programState.breakpoints]);

  return (
    <>
      <h2>Visualization</h2>
      <div className="visualization">
        <div className="program-field">
          {programState.program.map((instruction, index) => (
            <span
              key={index}
              className={(isStarted(programState) && isCurrentPc(index)
                ? "highlighted"
                : ""
              ).concat(breakpoints[index] ? " breakpoint" : "")}
              onClick={() => dispatch({ type: "breakpoint", data: index })}
            >
              {instruction}
            </span>
          ))}
          <p>parsed program</p>
        </div>
        <div>
          <p>
            program counter: {programState.programCounter}
            {programState.blocked ? " (waiting for input)" : ""}
          </p>
          <p>data pointer: {programState.dataPointer}</p>
          <p>current data: {programState.memory.query(programState.dataPointer)}</p>
        </div>
      </div>
    </>
  );
};

export default Visualization;
