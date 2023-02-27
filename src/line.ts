import Point from './point.js';
export default class Line {
  start: Point;
  end: Point;
  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }

  distance() {
    return Math.sqrt(
      (this.end.x - this.start.x) ** 2 + (this.end.y - this.start.y) ** 2
    );
  }

  slope() {
    // Luckily we don't need to worry about divide-by-zero since javascript will return +Infinity or -Infinity accordingly
    return (this.end.y - this.start.y) / (this.end.x - this.start.x);
  }

  toString() {
    return `${this.start} --> ${this.end}`;
  }
}
