// @flow

import type {
  PathComponent
} from './path';

export type DrawOptions = {

};

export type CanvasDrawingSurfaceOptions = {
  selector: ?string,
  target: ?HTMLElement,
  drawOptions: ?DrawOptions
};

class CanvasDrawingSurface {
  constructor(context: CanvasRenderingContext2D, options: ?DrawOptions) {
  }

  static create(options: ?CanvasDrawingSurfaceOptions): CanvasDrawingSurface {
    let target = document.body;
    if (options && options.target) {
      target = options.target;
    } else if (options && options.selector) {
      target = document.querySelector(options.selector);
    }

    if (!(target instanceof HTMLCanvasElement)) {
      throw new Error('A canvas drawing surface must be provided a valid canvas target');
    }

    const context = target.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D rendering context for canvas element');
    }

    return new CanvasDrawingSurface(context, options && options.drawOptions);
  }

  drawPath(path: Array<PathComponent>, x: number, y: number): void {
    for (let component of path) {
      switch (component.type) {
      }
    }
  }
}

module.exports = {
  CanvasDrawingSurface
};
