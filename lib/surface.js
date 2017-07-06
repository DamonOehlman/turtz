// @flow

import type {
  PathComponent
} from './path';

export interface DrawingSurface {
  drawPath(path: Array<PathComponent>, x: number, y: number): void;

  // instructions to prepare and finalize the surface during a animation cycle
  prepare(): void;
  finalize(): void;
}
