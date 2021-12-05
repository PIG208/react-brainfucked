import { useState } from "react";

import { IOAction, ioReducer, IOStream } from "../core/IOStream";
import { ReducerHookReturnType } from "../types";

export const useStream = (size: number): ReducerHookReturnType<IOStream, IOAction> => {
  const [stream, setStream] = useState<IOStream>({
    buffer: [],
    size: size,
    pointer: 0,
    readPointer: 0,
    readBuffer: [],
    pendingSize: 0,
  });

  const dispatch = (action: IOAction) => {
    setStream(ioReducer(stream, action));
  };

  return [stream, dispatch];
};
