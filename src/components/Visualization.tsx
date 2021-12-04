import { ProgramState } from "../core/Interpreter";

export type VisualizationProps = {
  programState: ProgramState;
};

const Visualization = ({ programState }: VisualizationProps) => {
  return (
    <>
      <p>program counter: {programState.programCounter}</p>
      <p>data pointer: {programState.dataPointer}</p>
      <p>curretn data: {programState.memory.query(programState.dataPointer)}</p>
      <div>
        {programState.program.map((instruction, index) => (
          <span
            key={index}
            style={{ color: index === programState.programCounter ? "red" : "black" }}
          >
            {instruction}
          </span>
        ))}
      </div>
    </>
  );
};

export default Visualization;
