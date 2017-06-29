// @flow

const { Turtle, Pen, Move, Turn } = require('..');
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

/** EXPECTED OUTPUT SHOULD LOOK SOMETHING LIKE (TODO: use unicode)
 *   -
 *  | |
 *   -
 *
 *  |
 */

turtle.drawTo(new Paper(), 50, 50);
