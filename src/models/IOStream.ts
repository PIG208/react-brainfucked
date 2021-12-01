export type IOStream = {
  buffer: number[];
  size: number;
  pointer: number;
};

export type ReadOutput = [stream: IOStream, data: number];

export const read = (stream: IOStream): ReadOutput => {
  let newStream = Object.assign({}, stream);
  let value = newStream.buffer[newStream.pointer++];

  return [newStream, value];
};

export const write = (stream: IOStream, data: number): IOStream => {
  let newStream = Object.assign({}, stream);

  if (newStream.pointer === newStream.buffer.length)
    newStream.buffer.push(data);
  else newStream.buffer[newStream.pointer] = data;

  newStream.pointer++;

  return newStream;
};
