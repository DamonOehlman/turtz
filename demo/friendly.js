// @flow

const {
  Turtle,
  Pen,
  Move,
  Turn,
  CanvasDrawingSurface
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

const turtle = Turtle.create([
  Pen.down(),
  Move.forward(50),
  Pen.up(),
  Move.forward(50),
  square(50)
]);

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  document.body.appendChild(canvas);

  const surface = CanvasDrawingSurface.create(canvas);

  /** EXPECTED OUTPUT SHOULD LOOK SOMETHING LIKE (TODO: use unicode)
   *   -
   *  | |
   *   -
   *
   *  |
   */

  turtle.drawTo(surface, 50, 50);

});
