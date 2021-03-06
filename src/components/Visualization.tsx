import { useMemo } from "react";

import { BrainfuckAction } from "../hooks/useBrainfuck";

import "../css/Visualization.css";

import { isStarted, ProgramState } from "../core/Interpreter";
import Collapsable from "./Collapsable";
import Memory from "./Memory";

export type VisualizationProps = {
  programState: ProgramState;
  dispatch: (action: BrainfuckAction) => void;
  memoryDisplayCount: number;
};

const Visualization = ({ programState, dispatch, memoryDisplayCount }: VisualizationProps) => {
  const memoryLower = Math.max(0, programState.dataPointer - Math.floor(memoryDisplayCount / 2));
  const memoryUpper = Math.min(memoryLower + memoryDisplayCount, programState.memory.size());
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
    <div>
      <h2>Visualization</h2>
      <Collapsable altText="Show parsed program">
        <p>parsed program</p>
        <div className="program-grid">
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
          </div>
          <div>
            <p>cycles: {programState.age}</p>
            <p>
              program counter: {programState.programCounter}
              {programState.blocked && programState.blockType === "io"
                ? " (waiting for input)"
                : ""}
            </p>
            <p>data pointer: {programState.dataPointer}</p>
            <p>current data: {programState.memory.query(programState.dataPointer)}</p>
          </div>
        </div>
      </Collapsable>
      <Collapsable altText="Show memory cells">
        {" "}
        <p>Memory Cells</p>
        <Memory programState={programState} memoryLower={memoryLower} memoryUpper={memoryUpper} />
      </Collapsable>
    </div>
  );
};

export default Visualization;
