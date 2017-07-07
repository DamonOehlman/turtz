// @flow

import type {
  InstructionBuilder,
  Instruction,
  NestedInstructionList
} from './lib/instructions';

/**
/**
 * Execute an instruction builder <tt>count</tt> times. Any arguments (untyped) that
 * should be supplied to the builder can be passed in the rest parameters.
 */
function repeat(count: number, builder: InstructionBuilder): NestedInstructionList {
  let items = [];
  for (let index = 0; index < count; index += 1) {
    items = items.concat(builder());
  }

  return {
    type: 'NESTED',
    value: items
  };
};



module.exports = {
  repeat
};
