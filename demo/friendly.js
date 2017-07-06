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
  Move.forward(50),
  Pen.up(),
  Move.forward(50),
  square(50)
];

window.addEventListener('DOMContentLoaded', () => {
  Application.create({}, surface => {
    const path = Path.build(lineAndSquare);

    /** EXPECTED OUTPUT SHOULD LOOK SOMETHING LIKE (TODO: use unicode)
     *   -
     *  | |
     *   -
     *
     *  |
     */

    surface.draw(path, 50, 50);
  });
});
