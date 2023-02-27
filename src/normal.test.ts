import { innerNormal, outerNormal } from './normal';
import Line from './line';
import Point from './point';
import Vector from './vector';

describe('counterclockwise rectangle', () => {
  test('right, then up', () => {
    const line = new Line(new Point(1, 0), new Point(6, 0));
    const nextLine = new Line(new Point(6, 0), new Point(6, 10));
    const normal = outerNormal(line, nextLine);
    // Line goes from 1,0 -> 6,0
    // Outer normal goes from 1,0 to 0,-6
    // The normalized vector for that is (0, -1)
    expect(normal).toEqual(new Vector(0, -1));
    expect(normal.magnitude()).toBe(1);

    expect(innerNormal(line, nextLine)).toEqual(new Vector(-0, 1));
  });

  test('up, then right', () => {
    const line = new Line(new Point(6, 0), new Point(6, 10));
    const nextLine = new Line(new Point(1, 10), new Point(1, 0));
    const normal = outerNormal(line, nextLine);
    expect(normal).toEqual(new Vector(1, -0));
  });

  test('left, then down', () => {
    const line = new Line(new Point(6, 10), new Point(1, 10));
    const nextLine = new Line(new Point(1, 10), new Point(1, 0));
    const normal = outerNormal(line, nextLine);
    expect(normal).toEqual(new Vector(0, 1));
  });

  test('down, then right', () => {
    const line = new Line(new Point(1, 10), new Point(1, 0));
    const nextLine = new Line(new Point(1, 0), new Point(6, 0));
    const normal = outerNormal(line, nextLine);
    expect(normal).toEqual(new Vector(-1, -0));
  });
});

describe('clockwise rectangle', () => {
  test('up, then right', () => {
    const line = new Line(new Point(1, 0), new Point(1, 10));
    const nextLine = new Line(new Point(1, 10), new Point(6, 10));
    const normal = outerNormal(line, nextLine);
    expect(normal).toEqual(new Vector(-1, 0));
    expect(normal.magnitude()).toBe(1);

    expect(innerNormal(line, nextLine)).toEqual(new Vector(1, -0));
  });

  test('right, then down', () => {
    const line = new Line(new Point(1, 10), new Point(6, 10));
    const nextLine = new Line(new Point(6, 10), new Point(6, 0));
    const normal = outerNormal(line, nextLine);
    expect(normal).toEqual(new Vector(-0, 1));
  });

  test('down, then left', () => {
    const line = new Line(new Point(6, 10), new Point(6, 0));
    const nextLine = new Line(new Point(1, 10), new Point(1, 0));
    const normal = outerNormal(line, nextLine);
    expect(normal).toEqual(new Vector(1, 0));
  });

  test('left, then up', () => {
    const line = new Line(new Point(6, 0), new Point(1, 0));
    const nextLine = new Line(new Point(1, 0), new Point(1, 10));
    const normal = outerNormal(line, nextLine);
    expect(normal).toEqual(new Vector(-0, -1));
  });
});

describe('3-4-5 triangle', () => {
  const line = new Line(new Point(1, 1), new Point(4, 5));
  const nextLine = new Line(new Point(4, 5), new Point(5, 1));
  const normal = outerNormal(line, nextLine);

  // The line goes right 3 and up 4
  // so the perpendicular line should go right 4 and up 3
  // The magnitude of this line is 5, so the unit vector is (-4/5, 3/5)
  expect(normal).toEqual(new Vector(-0.8, 0.6));
  expect(normal.magnitude()).toBe(1);
});
