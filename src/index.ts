import Point from './point.js';
import Vector from './vector.js';
import Line from './line.js';
import { innerNormal } from './normal.js';
import { isConvex, isValid, normalize } from './polygon.js';
import clipLines from './clip.js';

class InvalidPolygonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPolygonError';
  }
}

const fromVertices = (vertices: Array<[number, number]>): Array<Line> =>
  vertices.map(([x, y], i) => {
    const [endX, endY] = vertices[i + 1] ?? vertices[0];
    return new Line(new Point(x, y), new Point(endX, endY));
  });

export type Normals = Array<Vector>;

const getNormals = (polygon: Array<Line>): Normals =>
  polygon.map((line, i, lines) => {
    const nextLine = lines[i + 1] ?? lines[0];
    return innerNormal(line, nextLine);
  });

const clip = (
  polygon: Array<Line>,
  line: Line,
  options?: {
    normals?: Normals;
    skipNormalization?: boolean;
    skipValidation?: boolean;
  }
): Line | null => {
  if (!options?.skipNormalization) {
    polygon = normalize(polygon);
  }

  if (!options?.skipValidation) {
    if (!isValid(polygon)) {
      throw new InvalidPolygonError(
        'The provided polygon is not a closed, convex shape'
      );
    }
  }
  return clipLines(polygon, line, options?.normals);
};

export {
  clip,
  Point,
  Vector,
  Line,
  getNormals,
  isConvex,
  isValid,
  normalize,
  fromVertices,
};
