// @flow

const {
  Pen,
  Move,
  Turn,
  Path,
  Commands,
  Surface,
  Canvas
} = require('..');

const { repeat } = require('../logic');

const square = (size: number) => Commands.create([
  Pen.down(),
  repeat(4, [
    Move.forward(size),
    Turn.right(90)
  ]),
  Pen.up()
]);

const triangle = (size: number) => Commands.create([
  Pen.down(),
  repeat(3, [
      Move.forward(size),
      Turn.right(360 / 3)
  ]),
  Pen.up()
]);

const poly = (sides: number, size: number) => Commands.create([
  Pen.down(),
  repeat(sides, [
    Move.forward(size),
    Turn.right(360 / sides)
  ]),
  Pen.up()
]);

const lineAndSquare = () => Commands.create([
  Pen.down(),
  Turn.right(90),
  Move.forward(50),
  Turn.left(45),
  square(50),
]);

Canvas.create({})
  .then(surface => surface.draw(lineAndSquare(), 0, -100))
  .then(surface => surface.draw(square(50), -25, -25))
  .then(surface => surface.draw(poly(10, 50), 25, 25));
