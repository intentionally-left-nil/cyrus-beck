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

const closePolygon = (lines: Array<Line>): Array<Line> => {
  if (lines.length > 1) {
    const first = lines[0];
    const last = lines[lines.length - 1];
    return [...lines, new Line(last.end, first.start)];
  } else {
    return lines;
  }
};

const normalize = (lines: Array<Line>): Array<Line> =>
  // Ensure that the polygon is closed
  // If that already happened, then the degenerate point will get filtered out below
  closePolygon(lines)
    // Remove lines which are just points
    .filter((line) => !line.start.equals(line.end))
    // Concatenate consecutive lines which have the same slope
    .reduce((newLines: Array<Line>, line, i, lines) => {
      // N.B. It's possible to remove the first line
      // so we need to grab the first _output_ line when wrapping around
      const nextLine = lines[i + 1] ?? newLines[0];
      if (!nextLine) {
        newLines.push(line);
        // The two lines are on the same path
        // Maybe they double back, in which case the polygon isn't convex anyways
        // So just ignore that case and merge the lines
        // TODO: Handle this better
      } else if (line.slope() === nextLine.slope()) {
        // Merge this line into the next line, and drop the current one
        nextLine.start = line.start;
      } else {
        newLines.push(line);
      }
      return newLines;
    }, []);

const isConnected = (lines: Array<Line>): boolean => {
  if (lines.length < 1) {
    return false;
  }
  return lines
    .map((line, i) => {
      const nextLine = lines[i + 1] ?? lines[0];
      return line.end.equals(nextLine.start);
    })
    .every(Boolean);
};

const isValid = (lines: Array<Line>): boolean =>
  isConvex(lines) && isConnected(lines);

export { isConvex, normalize, isValid, isConnected };
