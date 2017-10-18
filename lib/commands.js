// @flow

const { denest } = require('./instructions');

import type {
  Instruction,
  NestedInstructionList
} from './instructions';

class Commands {
  static create(items: Array<Instruction>): NestedInstructionList {
    return {
      type: 'NESTED',
      value: items.slice()
    };
  }
}

module.exports = {
  Commands
};
