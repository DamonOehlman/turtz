// @flow

import type {
  InstructionBuilder,
  InstructionList
} from './lib/types';

exports.times = (
  count: number,
  builder: InstructionBuilder,
  ...args: Array<?>
): Promise<InstructionList> => {
  let results = [];
  for (let index = 0; index < count; index += 1) {
    results = results.concat(builder || []);
  }

  return Promise.all(results);
};

exports.first = (builder: InstructionBuilder, ...args: Array<?>): Promise<InstructionList> => {
  return Promise.all([].concat(builder(args) || []));
};
