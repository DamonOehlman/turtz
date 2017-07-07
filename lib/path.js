// @flow

const { flatten } = require('lodash');
const { denest } = require('./instructions');
const { Geometry } = require('./geometry');

import type {
  Instruction
} from './instructions';

import type {
  Position
} from './geometry';

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

// PATH

class Path {
  components: Array<PathComponent>;
  length: number;

  constructor(components: Array<PathComponent>) {
    // take a copy of the components
    this.components = components.slice();

    // calculate the length of the path
    this.length = Path.calculateLength(this.components);
  }

  static fromInstructions(input: Array<Instruction | Array<Instruction>>): Path {
    // convert the input into a single dimensional array of instructions
    return new Path(instructionsToPath(denest(flatten(input))));
  }

  static translate(input: Array<PathComponent>, x: number, y: number): Array<PathComponent> {
    return input.slice();
  }

  static rotate(input: Array<PathComponent>, rotation: number): Array<PathComponent> {
    return input.slice();
  }

  static calculateLength(input: Array<PathComponent>): number {
    return 0;
  }
}

// PATH BUILDER

class PathBuilder {
  static line(position: Position): LineToComponent {
    return {
      type: 'L',
      position
    };
  }

  static move(position: Position): MoveToComponent {
    return {
      type: 'M',
      position
    };
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
  let penDown: boolean = false;
  let position: Position = [0, 0];
  let heading = 270; // 0 == ->

  return instructions.reduce((memo, instruction) => {
    switch (instruction.type) {
      case 'PEN_DOWN': {
        penDown = instruction.value;
        break;
      }

      case 'MOVE': {
        // determine the new position based on the heading and move value
        position = Geometry.moveWithHeading(position, heading, instruction.value);

        // TODO: work out how to make flow happy using a ternary for type (penDown ? 'L' : 'M')
        if (penDown) {
          memo = memo.concat(PathBuilder.line(position));
        } else {
          memo = memo.concat(PathBuilder.move(position));
        }

        break;
      }

      case 'ROTATE': {
        heading = (heading + instruction.value) % 360;
        break;
      }

      default: {
        throw new Error('Unknown instruction type, cannot create path');
      }
    }

    return memo;
  }, []);
}

// EXPORTS

module.exports = {
  Path
};
