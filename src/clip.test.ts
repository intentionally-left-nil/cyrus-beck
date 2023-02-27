import Line from './line';
import Point from './point';
import clip from './clip';

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

const createEdges = (vertices: Array<Point>): Array<Line> =>
  vertices.map((point, i, vertices) => {
    const nextPoint = vertices[i + 1] ?? vertices[0];
    return new Line(point, nextPoint);
  });

test('no clipping if inside, but not parallel to any edge', () => {
  const vertices = [new Point(1, 1), new Point(5, 1), new Point(3, 10)];
  const line = new Line(new Point(2, 2), new Point(3, 4));
  const clipped = clip(createEdges(vertices), line);
  validateLine(clipped, line);
});

test('no clipping if inside, and parallel to one edge', () => {
  const vertices = [new Point(1, 1), new Point(5, 1), new Point(3, 10)];
  const line = new Line(new Point(2, 2), new Point(3, 2));
  const clipped = clip(createEdges(vertices), line);
  validateLine(clipped, line);
});

test('no clipping if exactly on an edge', () => {
  const vertices = [new Point(1, 1), new Point(5, 1), new Point(3, 10)];
  const line = new Line(new Point(2, 1), new Point(3, 1));
  const clipped = clip(createEdges(vertices), line);
  validateLine(clipped, line);
});

test('Return null if the line is outside every edge', () => {
  const vertices = [new Point(1, 1), new Point(5, 1), new Point(3, 10)];
  const line = new Line(new Point(22, 22), new Point(23, 24));
  const clipped = clip(createEdges(vertices), line);
  expect(clipped).toBeNull();
});

test('fully clipped if parallel to one edge', () => {
  const vertices = [new Point(1, 1), new Point(5, 1), new Point(3, 10)];
  const line = new Line(new Point(0, 0), new Point(3, 0));
  const clipped = clip(createEdges(vertices), line);
  expect(clipped).toBeNull();
});

test('partially clipped if extending past one edge', () => {
  const vertices = [new Point(1, 1), new Point(5, 1), new Point(3, 10)];
  const line = new Line(new Point(2, 1), new Point(6, 1));
  const clipped = clip(createEdges(vertices), line);
  validateLine(clipped, new Line(line.start, new Point(5, 1)));
});

test('clip just the left end', () => {
  const vertices = [new Point(1, 1), new Point(5, 1), new Point(3, 10)];
  const line = new Line(new Point(0, 2), new Point(3, 2));
  const clipped = clip(createEdges(vertices), line);
  validateLine(clipped, new Line(new Point(11 / 9, 2), line.end));
});

test('clip just the right end', () => {
  const vertices = [new Point(1, 1), new Point(5, 1), new Point(3, 10)];
  const line = new Line(new Point(3, 2), new Point(7, 2));
  const clipped = clip(createEdges(vertices), line);
  validateLine(clipped, new Line(line.start, new Point(4 + 7 / 9, 2)));
});

test('clips both ends', () => {
  const vertices = [new Point(1, 1), new Point(5, 1), new Point(3, 10)];
  const line = new Line(new Point(0, 2), new Point(7, 2));
  const clipped = clip(createEdges(vertices), line);
  validateLine(
    clipped,
    new Line(new Point(11 / 9, 2), new Point(4 + 7 / 9, 2))
  );
});

test('known internet example', () => {
  const vertices = [
    new Point(3, 0),
    new Point(1, 2),
    new Point(1, 4),
    new Point(3, 6),
    new Point(5, 4),
    new Point(5, 2),
  ];
  const line = new Line(new Point(-2, 1), new Point(6, 3));
  const clipped = clip(createEdges(vertices), line);
  validateLine(clipped, new Line(new Point(1.2, 1.8), new Point(5, 2.75)));
});
