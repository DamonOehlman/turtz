// @flow

import type {
  PathComponent,
  PathOrInstructions
} from './path';

import type {
  Instruction
} from './instructions';

export interface DrawingSurface {
  draw(input: PathOrInstructions, x: number, y: number): void;

  // instructions to prepare and finalize the surface during a animation cycle
  startLoop(tickDelta: number): void;
  finishLoop(): void;
}
