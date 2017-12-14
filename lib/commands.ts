import { Instruction, NestedInstructionList, denest } from './instructions';

export class Commands {
  static create(items: Array<Instruction>): NestedInstructionList {
    return {
      type: 'NESTED',
      value: items.slice()
    };
  }
}
