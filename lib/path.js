// @flow

const { flatten } = require('lodash');
const { denest } = require('./instructions');

const DEGREES_TO_RADIANS = Math.PI / 180;

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
        position = moveWithHeading(position, heading, instruction.value);
        console.log(`moving, pen down = ${String(penDown)}`);

        // TODO: work out how to make flow happy using a ternary for type (penDown ? 'L' : 'M')
        if (penDown) {
          memo = memo.concat({
            type: 'L',
            position: position
          });
        } else {
          memo = memo.concat({
            type: 'M',
            position: position
          })
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

function moveWithHeading(current: Position, heading: number, distance: number): Position {
  const deltaX = Math.cos(heading * DEGREES_TO_RADIANS) * distance;
  const deltaY = Math.sin(heading * DEGREES_TO_RADIANS) * distance;
  return [ current[0] + deltaX, current[1] + deltaY ];
}

// EXPORTS

module.exports = {
  PathBuilder
};
