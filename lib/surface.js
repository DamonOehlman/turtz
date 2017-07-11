// @flow

const { Path } = require('./path');

import type {
  PathComponent,
  PathOrInstructions
} from './path';

import type {
  Instruction
} from './instructions';

export type StartLoopData = {
  delta: number
};

export type SurfaceDrawResult = {
  done: boolean
};

export interface DrawingSurface {
  draw(input: PathOrInstructions, x: number, y: number): ?SurfaceDrawResult;

  // instructions to prepare and finalize the surface during a animation cycle
  startLoop(options: StartLoopData): void;
  finishLoop(): void;
}
