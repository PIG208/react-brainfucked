import "../css/Visualization.css";

import { isStarted, ProgramState } from "../core/Interpreter";

export type VisualizationProps = {
  programState: ProgramState;
};

const Visualization = ({ programState }: VisualizationProps) => {
  const isCurrentPc = (pc: number) =>
    (!programState.blocked &&
      (pc === programState.programCounter - 1 ||
        (pc === 0 && programState.programCounter === 0))) ||
    (programState.blocked && pc === programState.programCounter);

  return (
    <div>
      <p>
        program counter: {programState.programCounter}
        {programState.blocked ? " (waiting for input)" : ""}
      </p>
      <p>data pointer: {programState.dataPointer}</p>
      <p>current data: {programState.memory.query(programState.dataPointer)}</p>
      <p>memory size: {programState.memory.size()}</p>
      <div className="program-field">
        {programState.program.map((instruction, index) => (
          <span
            key={index}
            className={isStarted(programState) && isCurrentPc(index) ? "highlighted" : ""}
          >
            {instruction}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Visualization;
