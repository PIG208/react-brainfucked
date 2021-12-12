import { useCallback, useState } from "react";

import { initializeIOStream, IOAction, ioReducer, IOStream } from "../core/IOStream";
import { ReducerAction, ReducerHookReturnType } from "../types";

export type StreamAction = IOAction | ReducerAction<"reset">;

export const useStream = (size: number): ReducerHookReturnType<IOStream, StreamAction> => {
  const [stream, setStream] = useState<IOStream>(initializeIOStream(size));

  const dispatch = useCallback((action: StreamAction) => {
    if(action.type === "reset") {
      setStream(initializeIOStream(size));
      return;
    }

    setStream(stream => ioReducer(stream, action));
  }, [setStream, size]);

  return [stream, dispatch];
};
