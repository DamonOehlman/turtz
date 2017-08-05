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

function square(size: number) {
  return [
    Pen.down(),
    repeat(4, [
      Move.forward(size),
      Turn.right(90)
    ]),
    Pen.up()
  ];
}

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
  square(50),
];

window.addEventListener('DOMContentLoaded', () => {
  Application.create({}, surface => {
    return [
      surface.draw(lineAndSquare, 0, -100),
      surface.draw(square(50), -25, -25),
      surface.draw(poly(10, 50), 25, 25)
    ];
  });
});
