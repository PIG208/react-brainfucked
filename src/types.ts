import { ReactNode } from "react";

export type HasChildren<T = {}> = T & { children: ReactNode };
export type ReducerAction<T, V = undefined> = V extends undefined
  ? { type: T }
  : { type: T; data: V };
export type ReducerHookReturnType<T, A, B = undefined> = B extends undefined
  ? [T, (action: A) => void]
  : [T, (action: A) => void, B];
