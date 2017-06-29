// @flow

export type Delta = [number, number];
export type Position = [number, number];

export type MoveInstruction = {
  type: 'MOVE',
  value: Delta
};

export type ChangePositionInstruction = {
  type: 'POSITION',
  value: Position
};

export type RotateInstruction = {
  type: 'ROTATE',
  value: number
};

export type PenDownInstruction = {
  type: 'PEN_DOWN',
  value: boolean
};

export type NestedInstructionList = {
  type: 'NESTED',
  value: Array<Instruction>
}

export type Instruction = MoveInstruction
  | ChangePositionInstruction
  | RotateInstruction
  | PenDownInstruction
  | NestedInstructionList;

export type InstructionBuilder = () => Array<Instruction>;
