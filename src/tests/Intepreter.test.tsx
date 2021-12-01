import { parse } from "../models/Interpreter";
import { testHelloWorld } from "./Fixtures";

test("interpreter parse", () => {
  expect(parse(testHelloWorld.raw)).toEqual(Array.from(testHelloWorld.parsed));
});
