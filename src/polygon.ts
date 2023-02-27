import Line from './line.js';
import Vector from './vector.js';

const isConvex = (lines: Array<Line>): boolean => {
  if (lines.length < 3) {
    return false;
  }
  let requiredCardinality = null;
  for (let i = 0; i < lines.length; i += 1) {
    const lineVector = Vector.fromLine(lines[i]);
    const nextLineVector = Vector.fromLine(lines[i + 1] ?? lines[0]);
    const cross = lineVector.crossProduct(nextLineVector);
    const cardinality = cross > 0;

    // Convex polxygons all have the same z-product cardinality (e.g all positive cross products or all negative)
    // If any one is the other sign, then return false
    // Ignore parallel edges (consider them still convex)
    requiredCardinality = requiredCardinality ?? cardinality;
    if (cardinality != requiredCardinality) {
      return false;
    }
  }
  return true;
};

export { isConvex };
