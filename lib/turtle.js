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
  path: Array<PathComponent>;

  // TODO: how to flag as private so only factory method can be used
  constructor(path: Array<PathComponent>) {
    this.path = path;
  }

  static create(instructions: Array<Instruction | Array<Instruction>>) {
    const path = new PathBuilder()
      .addInstructions(instructions)
      .build();

    // then convert to path data
    return new Turtle(path);
  }

  drawTo(target: DrawingSurface, x: number, y: number) {
    target.drawPath(this.path, x, y);
  }
}

module.exports = {
  Turtle
};
