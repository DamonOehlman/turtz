/**
 * Defines movement in the forward (or backware dimension).  This is relative
 * to the current heading of the turtle, which is controlled through
 * `RotateInstruction`s.
 */
export type MoveInstruction = {
  type: 'MOVE';
  value: number;
};

/**
 * Change the heading of the turtle.
 */
export type RotateInstruction = {
  type: 'ROTATE';
  value: number;
};

/**
 * Set whether the pen of the turtle is up or down (i.e. drawing or not drawing).
 */
export type PenDownInstruction = {
  type: 'PEN_DOWN';
  value: boolean;
};

/**
 * An instruction which contains an array of nested instructions.
 */
export type NestedInstructionList = {
  type: 'NESTED';
  value: Array<Instruction>;
};

export type Instruction = MoveInstruction | RotateInstruction | PenDownInstruction | NestedInstructionList;

export type InstructionBuilder = () => Array<Instruction>;

// MOVEMENT

export class Move {
  static forward(value: number): MoveInstruction {
    return move(value);
  }

  static back(value: number): MoveInstruction {
    return move(-value);
  }
}

function move(value: number): MoveInstruction {
  return {
    type: 'MOVE',
    value: value
  };
}

// ROTATION

export class Rotate {
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

export class Pen {
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
    value
  };
}

// UTILITY FUNCTIONS

/**
 * The flatten function will expand all nested instructions into a single
 * dimension array of instructions.
 */
export function denest(input: NestedInstructionList): Array<Instruction> {
  if (input.type !== 'NESTED') {
    throw new Error('Can only denest a nested instruction list');
  }

  return input.value.reduce((memo, item) => {
    switch (item.type) {
      case 'NESTED':
        return memo.concat(denest(item));

      case 'MOVE':
      case 'ROTATE':
      case 'PEN_DOWN':
        return memo.concat(item);

      default:
        throw new Error(`Unable to determine item type for item: %{item}`);
    }
  }, []);
}
