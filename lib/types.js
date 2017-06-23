// @flow

export type RelativePosition = [number, number];

export type InstructionList = Array<Instruction>;
export type InstructionBuilder = () => InstructionList;
