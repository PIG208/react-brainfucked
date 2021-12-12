import "../css/Memory.css";

import { ProgramState } from "../core/Interpreter";

export type MemoryProps = {
  programState: ProgramState;
  memoryLower: number;
  memoryUpper: number;
};

type MemoryBlockProps = {
  index: number;
  value: number;
  highlighted: boolean;
};

const MemoryBlock = ({ index, value, highlighted }: MemoryBlockProps) => {
  return (
    <div className={`memory-block${highlighted ? " memory-block-highlighted" : ""}`}>
      <div>{index}</div>
      <div>
        {value}|{value.toString(16)}|{JSON.stringify(String.fromCharCode(value)).slice(1, -1)}
      </div>
    </div>
  );
};

const Memory = ({ programState, memoryLower, memoryUpper }: MemoryProps) => {
  return (
    <div className="memory-field">
      {programState.memory.slice(memoryLower, memoryUpper).map((value, index) => {
        const memIndex = index + memoryLower;
        return (
          <MemoryBlock
            index={memIndex}
            value={value}
            highlighted={programState.dataPointer === memIndex}
            key={memIndex}
          ></MemoryBlock>
        );
      })}
      <p className="memory-size">
        Showing {memoryUpper - memoryLower} of {programState.memory.size()} memory blocks.
      </p>
    </div>
  );
};

export default Memory;
