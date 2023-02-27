export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  magnitude() {
    // a^2 + b^2 = c^2
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  slope() {
    return this.y / this.x;
  }

  unitVector(): Vector {
    const magnitude = this.magnitude() || 1; // A magnitude of 0 means that x == 0 & y == 0, so this is just a no-op
    return new Vector(this.x / magnitude, this.y / magnitude);
  }

  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }

  crossProduct(other: Vector): number {
    return this.x * other.y - this.y * other.x;
  }
}
