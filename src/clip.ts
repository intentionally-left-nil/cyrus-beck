import Line from './line.js';
import { innerNormal } from './normal.js';
import Point from './point.js';
import Vector from './vector.js';

const clip = (
  polygon: Array<Line>,
  line: Line,
  normals?: Array<Vector>
): Line | null => {
  const n =
    normals ??
    polygon.map((line, i, lines) => {
      const nextLine = lines[i + 1] ?? lines[0];
      return innerNormal(line, nextLine);
    });
  return clipImpl(polygon, line, n);
};

// Resources
// Academic paper: https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.302.5729&rep=rep1&type=pdf
// Implementation: https://web.archive.org/web/20101203041134/http://cs1.bradley.edu/public/jcm/cs535CyrusBeck.html
// Youtube: https://www.youtube.com/watch?v=AHiuIYe1z0k
const clipImpl = (
  polygon: Array<Line>,
  line: Line,
  normals: Array<Vector>
): Line | null => {
  const lineDistance = Vector.fromLine(line);
  const { enterTime, exitTime } = polygon.reduce(
    (acc, edge, i) => {
      const normal = normals[i];
      const weightFactor = Vector.fromLine(new Line(edge.start, line.start));
      const numerator = -normal.dot(weightFactor);
      const denominator = normal.dot(lineDistance);
      if (denominator == 0) {
        if (numerator > 0) {
          // The line is parallel to the edge, and outside the polygon
          // Reject this entire line
          acc.enterTime = 0.999;
          acc.exitTime = 0.001;
        }
      } else {
        const time = numerator / denominator;
        if (denominator < 0) {
          // exit (upper) time
          if (time <= 1) {
            acc.exitTime = Math.min(acc.exitTime, time);
          }
        } else if (time >= 0) {
          // enter (lower) time
          acc.enterTime = Math.max(acc.enterTime, time);
        }
      }
      return acc;
    },
    { enterTime: 0, exitTime: 1, visible: true }
  );
  let clippedLine: Line | null = null;
  if (enterTime <= exitTime) {
    const start = new Point(
      line.start.x + lineDistance.x * enterTime,
      line.start.y + lineDistance.y * enterTime
    );
    const end = new Point(
      line.start.x + lineDistance.x * exitTime,
      line.start.y + lineDistance.y * exitTime
    );
    clippedLine = new Line(start, end);
  }
  return clippedLine;
};

export default clip;
