# cyrus-beck

Given a polygon (P) and a line, this package clips the line such that it is wholly contained within the polygon. Since this package implements the [Cyrus Beck](https://en.wikipedia.org/wiki/Cyrus%E2%80%93Beck_algorithm) algorithm, it works for any convex polygon (e.g. octogon) and not just rectangle clipping regions

# Usage

Installation: `npm install --save cyrus-beck`

```ts
import { clip, Line, Point, fromVertices } from 'cyrus-beck';

// Classic 3-4-5 right triangle
const triangle = fromVertices([
  [0, 0],
  [3, 0],
  [3, 4],
]);

const line = new Line(new Point(1, 1), new Point(6, 1));
const clippedLine = clip(triangle, line);
// clippedLine == new Line(new Point(1,1), new Point(3,1))
```

# Options

`clip()` takes in an optional 3rd argument to provide more flexibility:

```ts
clip = (
  polygon: Array<Line>,
  line: Line,
  options?: {
    normals?: Normals;
    skipNormalization?: boolean;
    skipValidation?: boolean;
  }
): Line | null
```

## Normals

The `normals` parameter is an internal representation of the polygon needed to perform the calculation. If you are repeatedly calling `clip()` with the same polygon, but different lines, you can speed up the calculation by caching the normals for the polygon and passing it in each time. The code looks like this:

```ts
import { clip, Line, Point, fromVertices, getNormals } from 'cyrus-beck';
const triangle = fromVertices([
  [0, 0],
  [3, 0],
  [3, 4],
]);

const normals = getNormals(triangle);
const line = new Line(new Point(1, 1), new Point(6, 1));
const clippedLine = clip(triangle, line, { normals });
// clippedLine == new Line(new Point(1,1), new Point(3,1))
```

## Normalization

The algorithm requires the polygon to be in good standing - no degenerate lines (points), having the last line connect to the first line, etc. This normalization happens automatically when calling `clip()`, but you can prevent this from occuring. Similar to the normals option, this is useful when using the same polygon multiple times

```ts
import { fromVertices, normalize } from 'cyrus-beck';
let triangle = fromVertices([
  [0, 0],
  [1, 0],
  [3, 0],
  [3, 4],
]);
triangles = normalize(triangles); // Returns a triangle with 3 points, not 4
clip(triangles, line, { skipNormalization: true });
```

## Skip Validation

Lastly, the polygon must be a proper [convex polygon](https://en.wikipedia.org/wiki/Convex_polygon). If you are sure you've passed in the correct indices, you can also disable this check.

```ts
clip(triangles, line, { skipValidation: true });
```

# Functions

## Clip

The primary function for this package. It utilizes the Cyrus-Beck algorithm to determine the intersection point of a line to a convex polygon

# Classes

## Point

Represents an X,Y coordinate pair. e.g. `new Point(3,5)`

## Line

A line (or more properly a directed segment) is represented here as storing two coordinates. E.g. `new Line(new Point(3,5), new Point(4,5))` would create a line of length 1 from (3,5) to (4,5)
