import createList from "../core/ImmutableList";

test("ImmutableList buildtree and query from array", () => {
  const data = [0, 2, 3, 4, 6];
  const list = createList(data);

  expect(list.query(0)).toEqual(0);
  expect(list.query(1)).toEqual(2);
  expect(list.query(2)).toEqual(3);
  expect(list.query(3)).toEqual(4);
  expect(list.query(4)).toEqual(6);
  expect(() => list.query(5)).toThrowError("List index out of bounds");
});

test("ImmutableList update tree", () => {
  const data = [1, 2, 5];
  const list = createList(data);

  expect(list.query(0)).toEqual(1);

  const newList = list.update(0, 5);
  expect(list.query(0)).toEqual(1);
  expect(newList.query(0)).toEqual(5);

  const largeData = Array(2 << 16).fill(0);
  const largeList = createList(largeData);
  const newLargeList = largeList.update(0, 233);

  expect(newLargeList.query(0)).toEqual(233);
});

test("ImmutableList slice tree", () => {
  const data = [4, 5, 6, 7, 7, 8, 8, 2, 3, 4, 5];
  const list = createList(data);

  expect(list.slice(3, 8)).toEqual(data.slice(3, 8));
  expect(list.slice(0, data.length)).toEqual(data.slice(0, data.length));
});
