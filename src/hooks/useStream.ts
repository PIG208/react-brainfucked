import { useState } from "react";

import { IOAction, ioReducer, IOStream } from "../core/IOStream";
import { ReducerHookReturnType } from "../types";

export const useStream = (size: number): ReducerHookReturnType<IOStream, IOAction> => {
  const [stream, setStream] = useState<IOStream>({
    buffer: [],
    size: size,
    pointer: 0,
    readBuffer: [],
  });

  const dispatch = (action: IOAction) => {
    setStream(ioReducer(stream, action));
  };

  return [stream, dispatch];
};
