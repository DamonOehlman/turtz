// @flow

const { Path } = require('./path');

import type {
  PathComponent
} from './path';

import type {
  Instruction
} from './instructions';

export type StartLoopData = {
  delta: number
};

export interface DrawingSurface {
  draw(input: Path, x: number, y: number): void;

  // instructions to prepare and finalize the surface during a animation cycle
  startLoop(options: StartLoopData): void;
  finishLoop(): void;
}
