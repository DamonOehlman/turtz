import { Pen, Move, Turn, Path, Commands, Canvas } from '../';
import { repeat } from '../logic';

const square = (size: number) => {
  return Commands.create([
    Pen.down(), //
    repeat(4, [Move.forward(size), Turn.right(90)]), //
    Pen.up() //
  ]);
};

const triangle = (size: number) => {
  return Commands.create([
    Pen.down(), //
    repeat(3, [Move.forward(size), Turn.right(360 / 3)]), //
    Pen.up()
  ]);
};

const poly = (sides: number, size: number) => {
  return Commands.create([
    Pen.down(), //
    repeat(sides, [Move.forward(size), Turn.right(360 / sides)]), //
    Pen.up()
  ]);
};

const lineAndSquare = () => {
  return Commands.create([
    Pen.down(), //
    Turn.right(90), //
    Move.forward(50), //
    Turn.left(45), //
    square(50)
  ]);
};

async function main() {
  const surface: Canvas = Canvas.create();

  // await surface.draw(lineAndSquare(), { x: 0, y: -100 });
  await surface.draw(lineAndSquare(), { x: 0, y: -100 });
  await surface.draw(square(50), { x: -25, y: -25 });
  await surface.draw(poly(10, 50), { x: 25, y: 25 });
}

main();
