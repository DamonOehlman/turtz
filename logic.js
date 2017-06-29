// @flow

import type {
  InstructionBuilder,
  Instruction,
  NestedInstructionList
} from './lib/types';

/**
/**
 * Execute an instruction builder <tt>count</tt> times. Any arguments (untyped) that
 * should be supplied to the builder can be passed in the rest parameters.
 */
function times(count: number, builder: InstructionBuilder): NestedInstructionList {
  let items = [];
  for (let index = 0; index < count; index += 1) {
    items = items.concat(builder());
  }

  return {
    type: 'NESTED',
    value: items
  };
};

/**
 * The flatten function will expand all nested instructions into a single
 * dimension array of instructions.
 */
function flatten(input: Array<Instruction>): Array<Instruction> {
  return input.reduce((memo, item) => {
    // if we have a nested array of instructions (not an explicit nested instruction)
    // expand that array
    if (Array.isArray(item)) {
      return memo.concat(flatten(input));
    }

    switch (item.type) {
      case 'NESTED':
        return memo.concat(flatten(item.value));

      case 'MOVE':
      case 'ROTATE':
      case 'PEN_DOWN':
        return memo.concat(item);

      default:
        throw new Error(`Unable to determine item type for item: %{item}`);
    }
  }, []);
}

module.exports = {
  times
};
