import Vector from './vector';

test('magnitude', () => {
  expect(new Vector(0, 0).magnitude()).toBe(0);
  expect(new Vector(1, 0).magnitude()).toBe(1);
  expect(new Vector(2, 3).magnitude()).toEqual(Math.sqrt(13));
});

test('slope', () => {
  expect(new Vector(0, 0).slope()).toBeNaN();
  expect(new Vector(0, 1).slope()).toBe(Number.POSITIVE_INFINITY);
  expect(new Vector(0, -1).slope()).toBe(Number.NEGATIVE_INFINITY);
  expect(new Vector(1, 0).slope()).toBe(0);
  expect(new Vector(2, 6).slope()).toBe(3);
});

test('unitVector', () => {
  for (const { x, y, expected } of [
    { x: 0, y: 0, expected: { x: 0, y: 0 } },
    { x: 1, y: 0, expected: { x: 1, y: 0 } },
    { x: 0, y: 1, expected: { x: 0, y: 1 } },
    { x: 0, y: -1, expected: { x: 0, y: -1 } },
    { x: -1, y: 0, expected: { x: -1, y: 0 } },
    { x: 1, y: 1, expected: { x: 1 / Math.sqrt(2), y: 1 / Math.sqrt(2) } },
    { x: 1, y: 5, expected: { x: 1 / Math.sqrt(26), y: 5 / Math.sqrt(26) } },
  ]) {
    expect(new Vector(x, y).unitVector()).toEqual(
      new Vector(expected.x, expected.y)
    );
  }
});

test('dot product', () => {
  expect(new Vector(0, 0).dot(new Vector(0, 0))).toBe(0);
  expect(new Vector(0, 1).dot(new Vector(1, 1))).toBe(1);
  expect(new Vector(0, 2).dot(new Vector(1, 1))).toBe(2);
  expect(new Vector(3, 2).dot(new Vector(4, 5))).toBe(22);
});

test('crossProduct', () => {
  expect(new Vector(0, 0).crossProduct(new Vector(0, 0))).toBe(0);
  expect(new Vector(3, 2).crossProduct(new Vector(-4, 5))).toBe(23);
  expect(new Vector(-4, 5).crossProduct(new Vector(3, 2))).toBe(-23);
});
