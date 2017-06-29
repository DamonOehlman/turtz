// @flow

import type {
  PathComponent
} from './path';

export interface DrawingSurface {
  drawPath(path: Array<PathComponent>, x: number, y: number);
}
