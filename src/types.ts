import { ReactNode } from "react";

export type HasChildren<T = {}> = T & { children: ReactNode };
