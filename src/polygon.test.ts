import Line from './line';
import Point from './point';
import { isConvex } from './polygon';

function createPolygon(vertices: Array<[number, number]>) {
  return vertices
    .map(([x, y]) => new Point(x, y))
    .map((start, i, points) => {
      const end = points[i + 1] ?? points[0];
      return new Line(start, end);
    });
}
test('a line is not convex', () => {
  const p = createPolygon([
    [0, 0],
    [1, 0],
  ]);
  expect(isConvex(p)).toBe(false);
});

test('A right triangle is convex', () => {
  const p = createPolygon([
    [0, 0],
    [5, 0],
    [5, 5],
  ]);
  expect(isConvex(p)).toBe(true);
});

test('A right triangle (flipped over x axis) is convex', () => {
  const p = createPolygon([
    [0, 0],
    [5, 0],
    [5, -5],
  ]);
  expect(isConvex(p)).toBe(true);
});

test('An acute triangle is convex', () => {
  const p = createPolygon([
    [-3, -5],
    [-4, 0],
    [1, 1],
  ]);
  expect(isConvex(p)).toBe(true);
});

test('An obtuse triangle is convex', () => {
  const p = createPolygon([
    [0, 0],
    [-2, 5],
    [3, 0],
  ]);
  expect(isConvex(p)).toBe(true);
});

test('An square is convex', () => {
  const p = createPolygon([
    [0, 0],
    [5, 0],
    [5, 5],
    [0, 5],
  ]);
  expect(isConvex(p)).toBe(true);
});

test('An 4 sided shape with a divot is not convex', () => {
  const p = createPolygon([
    [0, 0],
    [1, -3],
    [-1, -4], // Create the pacman
    [50, -50],
  ]);
  expect(isConvex(p)).toBe(false);
});
