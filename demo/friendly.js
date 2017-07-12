// @flow

const {
  Pen,
  Move,
  Turn,
  Path,
  CanvasDrawingSurface,
  Application
} = require('..');

const { repeat } = require('../logic');

const square = (size) => [
  Pen.down(),
  repeat(4, [
    Move.forward(size),
    Turn.right(90)
  ]),
  Pen.up()
];

const triangle = (size) => [
  Pen.down(),
  repeat(3, [
      Move.forward(size),
      Turn.right(360 / 3)
  ]),
  Pen.up()
];

const poly = (sides, size) => [
  Pen.down(),
  repeat(sides, [
    Move.forward(size),
    Turn.right(360 / sides)
  ]),
  Pen.up()
];

const lineAndSquare = [
  Pen.down(),
  Turn.right(90),
  Move.forward(50),
  Turn.left(45),
  poly(4, 50),
];

window.addEventListener('DOMContentLoaded', () => {
  Application.create({}, surface => {
    // const path = Path.fromInstructions(lineAndSquare);

    /** EXPECTED OUTPUT SHOULD LOOK SOMETHING LIKE (TODO: use unicode)
     *   -
     *  | |
     *   -
     *
     *  |
     */

    // surface.draw(path, 0, 0);
    surface.draw(square(50), 0, 0);
    return surface.draw(poly(9, 50), 0, 0);
  });
});
