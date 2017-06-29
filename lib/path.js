// @flow

const { flatten } = require('lodash');
const { denest } = require('./instructions');

import type {
  Instruction
} from './instructions';

export type Position = [number,number];

export type MoveToComponent = {
  type: 'M',
  position: Position
};

export type LineToComponent = {
  type: 'L',
  position: Position
};

export type CircleComponent = {
  type: 'C',
  radius: number
};

export type PathComponent = MoveToComponent
  | LineToComponent
  | CircleComponent;

export type Path = Array<PathComponent>;

// PATH BUILDER

class PathBuilder {
  components: Array<PathComponent>;

  constructor() {
    this.components = [];
  }

  add(component: PathComponent): this {
    this.components.push(component);

    return this;
  }

  addInstructions(input: Array<Instruction | Array<Instruction>>): this {
    // convert the input into a single dimensional array of commands
    const commands = denest(flatten(input));

    return this;
  }

  build(): Array<PathComponent> {
    return [];
  }
}

// EXPORTS

module.exports = {
  PathBuilder
};
