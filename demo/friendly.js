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

const smallSquare = square(50);
const bigSquare = square(200);
