import { ReducerAction } from "../types";

export type IOAction =
  | ReducerAction<"read" | "seek", number>
  | ReducerAction<"write", number | number[]>;
export type IOStream = {
  buffer: number[];
  size: number;
  pointer: number;
  // The buffer for the last read
  readPointer: number;
  readBuffer: number[];
  pendingSize: number;
};

export type ReadOutput = [stream: IOStream, data: number];

const copyStream = (stream: IOStream) => ({
  ...stream,
  buffer: stream.buffer.slice(0),
  readBuffer: stream.readBuffer.slice(0),
});

/**
 * When the stream is blocked (pendingSize > 0), no data will be read into the buffer
 */
export const read = (stream: IOStream, size: number): IOStream => {
  let newStream = copyStream(stream);
  if (newStream.pendingSize > 0 || newStream.buffer.length <= newStream.readPointer) {
    newStream.pendingSize += size;
    return newStream;
  }

  // Read `size` of bytes from the buffer
  newStream.readBuffer = newStream.buffer.slice(
    newStream.readPointer,
    newStream.readPointer + size
  );

  newStream.readPointer = newStream.readPointer + newStream.readBuffer.length;
  if (newStream.readBuffer.length < size) {
    // We haven't read enough bytes, expect more inputs
    newStream.pendingSize += size - newStream.readBuffer.length;
  }

  return newStream;
};

export const write = (stream: IOStream, data: number | number[]): IOStream => {
  if (typeof data == "number") data = [data];

  let newStream = copyStream(stream);
  newStream.buffer = newStream.buffer.slice(0, newStream.pointer).concat(data);
  newStream.pointer += data.length;

  if (newStream.pendingSize > 0) {
    // Prevent pendingSize from underflowing
    newStream.pendingSize = Math.max(newStream.pendingSize - data.length, 0);
  }

  return newStream;
};

const seek = (stream: IOStream, index: number): IOStream => {
  let newStream = copyStream(stream);
  newStream.pointer = index;
  newStream.readPointer = index;
  return newStream;
};

export const initializeIOStream = (size: number): IOStream => ({
  buffer: [],
  size: size,
  pointer: 0,
  readPointer: 0,
  readBuffer: [],
  pendingSize: 0,
});

export const ioReducer = (stream: IOStream, action: IOAction): IOStream => {
  switch (action.type) {
    case "read":
      return read(stream, action.data);
    case "write":
      return write(stream, action.data);
    case "seek":
      return seek(stream, action.data);
  }
};
