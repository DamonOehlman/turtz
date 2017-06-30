// @flow

const { flatten } = require('lodash');
const { denest } = require('./instructions');
const { PathBuilder } = require('./path');

import type {
  Instruction
} from './instructions';

import type {
  PathComponent
} from './path';

import type {
  DrawingSurface
} from './surface';

class Turtle {
  constructor(path: Array<PathComponent>) {

  }

  static create(instructions: Array<Instruction | Array<Instruction>>) {
    const path = new PathBuilder()
      .addInstructions(instructions)
      .build();

    // then convert to path data
    return new Turtle(path);
  }

  drawTo(target: DrawingSurface, x: number, y: number) {
  }
}

module.exports = {
  Turtle
};
