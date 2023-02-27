import Line from './line.js';
import Vector from './vector.js';

const outerNormal = (line: Line, nextLine: Line) => {
  const lineVector = Vector.fromLine(line);
  const possibleNormal = new Vector(-lineVector.y, lineVector.x);
  const alternativeNormal = new Vector(lineVector.y, -lineVector.x);

  const joinedLine = new Line(line.start, nextLine.end);
  const joinedVector = Vector.fromLine(joinedLine);

  const dotProduct = possibleNormal.dot(joinedVector);

  if (dotProduct === 0) {
    throw new Error(
      `line and nextLine have the same slope, and cannot be used to determine if this is an inner or outer normal`
    );
  }

  const normal = dotProduct < 0 ? possibleNormal : alternativeNormal;
  return normal.unitVector();
};

const innerNormal = (line: Line, nextLine: Line) => {
  const normal = outerNormal(line, nextLine);
  return new Vector(-normal.x, -normal.y);
};

export { innerNormal, outerNormal };
