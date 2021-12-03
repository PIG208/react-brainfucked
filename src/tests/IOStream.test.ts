import { ioReducer } from "../models/IOStream";
import { stringToASCIIs } from "../models/utils";
import { MockStream } from "./Fixtures";

test("IOStream read", () => {
  let stream = MockStream("a");

  expect(ioReducer(stream, {type: "read", data: 1}).readBuffer[0]).toEqual("a".charCodeAt(0));
  expect(ioReducer(stream, {type: "read", data: 1}).readBuffer[0]).toEqual("a".charCodeAt(0));

  stream = ioReducer(stream, {type: "read", data: 1});

  expect(() => ioReducer(stream, {type: "read", data: 1})).toThrowError("buffer overflowed");
});

test("IOStream write", () => {
  let stream = MockStream("a");

  expect(ioReducer(stream, {type: "read", data: 1}).readBuffer[0]).toEqual("a".charCodeAt(0));

  stream = ioReducer(stream, {type: "write", data: stringToASCIIs("ddd")});
  expect(stream.buffer).toEqual(stringToASCIIs("ddd"));
  expect(stream.buffer.length).toEqual(3);

  stream = ioReducer(stream, {type: "write", data: stringToASCIIs("k")});
  expect(stream.buffer).toEqual(stringToASCIIs("dddk"));
  expect(stream.buffer.length).toEqual(4);
});

test("IOStream seek", () => {
  let stream = MockStream("a");

  stream = ioReducer(stream, {type: "write", data: stringToASCIIs("kqweasd123")});
  expect(stream.buffer).toEqual(stringToASCIIs("kqweasd123"));

  stream = ioReducer(stream, {type: "seek", data: 2});
  expect(stream.pointer).toEqual(2);
  expect(ioReducer(stream, {"type": "read", "data": 4}).readBuffer).toEqual(stringToASCIIs("weas"));
});
