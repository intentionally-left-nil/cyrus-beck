import Line from './line';
import Point from './point';
test('slope', () => {
  expect(new Line(new Point(0, 0), new Point(0, 10)).slope()).toBe(
    Number.POSITIVE_INFINITY
  );
  expect(new Line(new Point(0, 0), new Point(0, -10)).slope()).toBe(
    Number.NEGATIVE_INFINITY
  );
  expect(new Line(new Point(0, 0), new Point(2, 4)).slope()).toBe(2);
});

test('distance', () => {
  expect(new Line(new Point(0, 0), new Point(0, 10)).distance()).toBe(10);
  expect(new Line(new Point(0, 0), new Point(0, -10)).distance()).toBe(10);
  expect(new Line(new Point(3, 2), new Point(4, 5)).distance()).toBe(
    Math.sqrt(10)
  );
});
