import { Turtle, Shape } from '..';
import { first, times } from '../logic';

class Square extends Shape {
  build(size) {

  }
}

const square = first(Turtle.penDown())
  .then(times(4, (size: number) => [
      Turtle.forward(size),
      Turtle.right(90)
    ]
  ))
  .then(Turtle.penUp());

// // @flow
// const turtz = require('..');

// turtz.define('square', size => {
//   this.penDown();
//   for (let ii = 0; ii < 4; ii++) {
//     this.forward(size);
//     this.rotate(90);
//   }
// });


// const square = turtz((turtle, size) => {
//   turtle.forward(size);
// });

// turtz(turtle => {
//   turtle.use()

//   turtle.square(10);
// });


// const shell = require('..');

// shell(turtle => {

// });


// const bot = require('bot');

// bot()
//   .forward(5)
//   .left(90)
//   .forward(5)
//   .at(10, 10);
