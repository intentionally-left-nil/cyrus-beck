export default class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    if (!isFinite(x) || !isFinite(y)) {
      throw new Error(`Cannot create a point from (${x},${y})`);
    }
    this.x = x;
    this.y = y;
  }

  equals(other: Point) {
    return this.x === other.x && this.y === other.y;
  }
}
