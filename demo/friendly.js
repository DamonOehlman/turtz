// @flow

const {
  Pen,
  Move,
  Turn,
  Path,
  CanvasDrawingSurface,
  Application
} = require('..');

const { times } = require('../logic');

const square = (size) => [
  Pen.down(),
  times(4, () => [
      Move.forward(size),
      Turn.right(90)
    ]
  ),
  Pen.up()
];

const lineAndSquare = [
  Pen.down(),
  Turn.right(45),
  Move.forward(50),
  Turn.left(45),
  Pen.up(),
  Move.forward(50),
  square(50)
];

window.addEventListener('DOMContentLoaded', () => {
  Application.create({}, surface => {
    const path = Path.fromInstructions(lineAndSquare);

    /** EXPECTED OUTPUT SHOULD LOOK SOMETHING LIKE (TODO: use unicode)
     *   -
     *  | |
     *   -
     *
     *  |
     */

    surface.draw(path, 0, 0);
  });
});
