// @flow

import type {
  Instruction,
  MoveInstruction,
  ChangePositionInstruction,
  RotateInstruction,
  PenDownInstruction,
  Position,
  Delta
} from './types.js';

// MOVEMENT

class Move {
  static forward(value: number): MoveInstruction {
    return move([0, value]);
  };

  static back(value: number): MoveInstruction {
    return move([0, -value]);
  }

  static left(value: number): MoveInstruction {
    return move([-value, 0]);
  }

  static right(value): MoveInstruction {
    return move([value, 0]);
  }

  static to(position: Position): ChangePositionInstruction {
    return {
      type: 'POSITION',
      value: position
    };
  }
}

function move(delta: Delta): MoveInstruction {
  return {
    type: 'MOVE',
    value: delta
  };
}

// ROTATION

class Rotate {
  static left(angle: number): RotateInstruction {
    return rotate(-angle);
  }

  static right(angle: number): RotateInstruction {
    return rotate(angle);
  }
}

function rotate(angle: number): RotateInstruction {
  return {
    type: 'ROTATE',
    value: angle
  };
}

// PEN

class Pen {
  static up(): PenDownInstruction {
    return penDown(false);
  }

  static down(): PenDownInstruction {
    return penDown(true);
  }
}

function penDown(value: boolean): PenDownInstruction {
  return {
    type: 'PEN_DOWN',
    value: true
  };
}

// EXPORTS

module.exports = {
  Move,
  Rotate,
  Pen
};
