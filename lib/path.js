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
    const instructions = denest(flatten(input));
    this.components = this.components.concat(instructionsToPath(instructions));

    return this;
  }

  build(): Array<PathComponent> {
    return this.components.slice();
  }
}

// UTILITIES

/**
 * Convert a single dimension array of instruction (no nested instructions) into
 * an array of path components (i.e. a Path)
 */
function instructionsToPath(instructions: Array<Instruction>): Array<PathComponent> {
  // first check if we have any nested instructions
  const nested = instructions.filter(instruction => instruction.type === 'NESTED');
  if (nested.length > 0) {
    throw new Error('Cannot create a path from instructions containing a nested instruction');
  }

  // initialise the state components for the path
  let penDown = false;
  let position: Position = [0, 0];
  let heading = 0;

  return instructions.reduce((memo, instruction) => {
    switch (instruction.type) {
      case 'PEN_DOWN': {
        penDown = instruction.value;
        break;
      }

      case 'MOVE': {
        // determine the new position based on the heading and move value
        position = moveWithHeading(position, heading);

        break;
      }

      case 'ROTATE': {
        heading += instruction.value;
        break;
      }

      default: {
        throw new Error('Unknown instruction type, cannot create path');
      }
    }

    return memo;
  }, []);
}

function moveWithHeading(current: Position, heading: number): Position {
  // TODO: trig...
  return [ current[0], current[1] ];
}

// EXPORTS

module.exports = {
  PathBuilder
};
