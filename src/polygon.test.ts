import Line from './line';
import Point from './point';
import { isConvex, isValid, normalize, isConnected } from './polygon';

function createPolygon(
  vertices: Array<[number, number]>,
  { closePolygon } = { closePolygon: true }
): Array<Line> {
  return vertices
    .map(([x, y]) => new Point(x, y))
    .map((start, i, points) => {
      const end = points[i + 1] ?? points[0];
      return new Line(start, end);
    })
    .slice(0, closePolygon ? vertices.length : -1);
}

const validatePoint = (actual: Point, expected: Point) => {
  expect(actual.x).toBeCloseTo(expected.x);
  expect(actual.y).toBeCloseTo(expected.y);
};
const validateLine = (actual: Line | null, expected: Line) => {
  expect(actual).not.toBeNull();
  if (actual != null) {
    validatePoint(actual.start, expected.start);
    validatePoint(actual.end, expected.end);
  }
};
const validateLines = (actual: Array<Line | null>, expected: Array<Line>) => {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((line, i) => validateLine(line, expected[i]));
};

describe('isConvex', () => {
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
});

describe('normalize', () => {
  test('empty array', () => {
    expect(normalize([])).toEqual([]);
  });

  test('A single point gets removed', () => {
    expect(
      normalize(
        createPolygon(
          [
            [1, 1],
            [1, 1],
          ],
          { closePolygon: false }
        )
      )
    ).toEqual([]);
  });

  test('a line is unchanged', () => {
    const actual = normalize(
      createPolygon(
        [
          [0, 0],
          [1, 1],
        ],
        { closePolygon: false }
      )
    );
    validateLines(
      actual,
      createPolygon(
        [
          [0, 0],
          [1, 1],
        ],
        { closePolygon: false }
      )
    );
  });
  test('a triangle with an extra point in the middle gets removed from lines', () => {
    const p = createPolygon([
      [0, 0],
      [1, 0],
      [2, 0],
      [4, 0],
      [2, 4],
    ]);
    validateLines(
      normalize(p),
      createPolygon([
        [0, 0],
        [4, 0],
        [2, 4],
      ])
    );
  });

  test('a triangle with an extra point at the wraparound between vertices gets removed from the lines', () => {
    const p = createPolygon([
      [2, 0],
      [4, 0],
      [2, 4],
      [0, 0],
    ]);
    validateLines(
      normalize(p),
      createPolygon([
        [0, 0],
        [4, 0],
        [2, 4],
      ])
    );
  });

  test('a triangle removing the first vertex and the wraparound from the lines', () => {
    const p = createPolygon([
      [2, 0],
      [3, 0],
      [4, 0],
      [2, 4],
      [0, 0],
    ]);
    validateLines(
      normalize(p),
      createPolygon([
        [0, 0],
        [4, 0],
        [2, 4],
      ])
    );
  });
});

describe('isConnected', () => {
  test('a single line is not connected', () => {
    expect(
      isConnected(
        createPolygon(
          [
            [0, 0],
            [1, 0],
          ],
          { closePolygon: false }
        )
      )
    ).toBe(false);
  });

  test('a gap is not connected', () => {
    expect(
      isConnected([
        new Line(new Point(0, 0), new Point(1, 0)),
        new Line(new Point(2, 0), new Point(0, 0)),
      ])
    );
  });

  test('an open box is not connected', () => {
    expect(
      isConnected(
        createPolygon(
          [
            [0, 0],
            [1, 0],
            [1, 1],
          ],
          { closePolygon: false }
        )
      )
    ).toBe(false);
  });
  test('a rectangle is connected', () => {
    expect(
      isConnected(
        createPolygon([
          [0, 0],
          [1, 0],
          [1, 1],
        ])
      )
    ).toBe(true);
  });
});
