import { ioReducer } from "../core/IOStream";
import { ASCIIsToString, stringToASCIIs } from "../core/utils";
import { MockStream } from "./Fixtures";

test("IOStream read", () => {
  let stream = MockStream("a");

  expect(ioReducer(stream, { type: "read", data: 1 }).readBuffer[0]).toEqual("a".charCodeAt(0));
  expect(ioReducer(stream, { type: "read", data: 1 }).readBuffer[0]).toEqual("a".charCodeAt(0));
});

test("IOStream write", () => {
  let stream = MockStream("a");

  expect(ioReducer(stream, { type: "read", data: 1 }).readBuffer[0]).toEqual("a".charCodeAt(0));

  stream = ioReducer(stream, { type: "write", data: stringToASCIIs("ddd") });
  expect(stream.buffer).toEqual(stringToASCIIs("ddd"));
  expect(stream.buffer.length).toEqual(3);

  stream = ioReducer(stream, { type: "write", data: stringToASCIIs("k") });
  expect(stream.buffer).toEqual(stringToASCIIs("dddk"));
  expect(stream.buffer.length).toEqual(4);
});

test("IOStream seek", () => {
  let stream = MockStream("a");

  stream = ioReducer(stream, { type: "write", data: stringToASCIIs("kqweasd123") });
  expect(stream.buffer).toEqual(stringToASCIIs("kqweasd123"));

  stream = ioReducer(stream, { type: "seek", data: 2 });
  expect(stream.pointer).toEqual(2);
  expect(ioReducer(stream, { type: "read", data: 4 }).readBuffer).toEqual(stringToASCIIs("weas"));
});

test("IOStream blocking empty", () => {
  let stream = MockStream("");

  stream = ioReducer(stream, { type: "read", data: 4 });
  expect(stream.pendingSize).toEqual(4);
  expect(stream.readBuffer).toEqual([]);

  stream = ioReducer(stream, { type: "write", data: stringToASCIIs("asdf") });

  stream = ioReducer(stream, { type: "read", data: 4 });
  expect(ASCIIsToString(stream.readBuffer)).toEqual("asdf");
});

test("IOStream blocking nonempty", () => {
  let stream = MockStream("as");

  // Partially read 2 bytes;
  stream = ioReducer(stream, { type: "read", data: 4 });
  expect(stream.pendingSize).toEqual(2);
  expect(stream.readPointer).toEqual(2);
  expect(ASCIIsToString(stream.readBuffer)).toEqual("as");

  stream = ioReducer(stream, { type: "seek", data: 2 });
  stream = ioReducer(stream, { type: "write", data: stringToASCIIs("kkdf") });
  expect(stream.pendingSize).toEqual(0);

  stream = ioReducer(stream, { type: "read", data: 2 });
  expect(ASCIIsToString(stream.readBuffer)).toEqual("kk");
});

test("IOStream read while blocked", () => {
  let stream = MockStream("");
  const firstRead = 4,
    secondRead = 2;

  // stream is blocked
  stream = ioReducer(stream, { type: "read", data: firstRead });
  expect(stream.pendingSize).toEqual(4);
  expect(ASCIIsToString(stream.readBuffer)).toEqual("");

  // stream is blocked
  stream = ioReducer(stream, { type: "read", data: secondRead });
  expect(stream.pendingSize).toEqual(6);
  expect(ASCIIsToString(stream.readBuffer)).toEqual("");

  // stream is unblocked
  stream = ioReducer(stream, { type: "write", data: stringToASCIIs("asd123") });
  expect(stream.pendingSize).toEqual(0);

  // stream is blocked
  stream = ioReducer(stream, { type: "read", data: firstRead + secondRead + 1 });
  expect(stream.pendingSize).toEqual(1);
  expect(ASCIIsToString(stream.readBuffer)).toEqual("asd123");
});
