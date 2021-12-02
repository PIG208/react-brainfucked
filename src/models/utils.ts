export const ASCIIsToString = (n: number[]): string => String.fromCharCode(...n);
export const stringToASCIIs = (s: string): number[] => Array.from(s).map((c) => c.charCodeAt(0));
