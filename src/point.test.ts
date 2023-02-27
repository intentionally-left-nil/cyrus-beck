import Point from './point';

test('point equality', () => {
  const point = new Point(0, 5);
  expect(point.equals(point)).toBe(true);
  expect(point.equals(new Point(0, 5))).toBe(true);
  expect(point.equals(new Point(1, 5))).toBe(false);
});

test('infinite points cannot be created', () => {
  expect(() => new Point(Number.POSITIVE_INFINITY, 5)).toThrow();
});
