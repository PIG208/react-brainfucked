import { ReactNode } from "react";

export type HasChildren<T = {}> = T & { children: ReactNode };
export type ReducerAction<T, V = undefined> = V extends undefined
  ? { type: T }
  : { type: T; data: V };
