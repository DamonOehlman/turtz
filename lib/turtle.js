// @flow

import {
  Position
} from './geometry.js';

import type {
  Instruction,
  InstructionType,
  RelativePosition
} from './types.js';

export class Turtle {
  static forward(value: number): Promise<Instruction> {
    return Promise.resolve([InstructionType.MOVE, [0, value]]);
  }

  static rotate(angle: number): Promise<Instruction> {
    return Promise.resolve([InstructionType.ROTATE, [angle]]);
  }

  static left(angle: number): Promise<Instruction> {
    return Turtle.rotate(-angle);
  }

  static right(angle: number): Promise<Instruction> {
    return Turtle.rotate(angle);
  }

  static penUp(): Promise<Instruction> {
    return Promise.resolve([InstructionType.PEN_UP]);
  }

  static penDown(): Promise<Instruction> {
    return Promise.resolve([InstructionType.PEN_DOWN]);
  }
}
