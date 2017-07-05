// @flow

import type {
  PathComponent,
  Position
} from './path';

export type DrawOptions = {

};

export type CanvasDrawingSurfaceOptions = {
  selector?: string,
  target?: HTMLElement,
  drawOptions?: DrawOptions
};

class CanvasDrawingSurface {
  context: CanvasRenderingContext2D;
  origin: Position;

  constructor(context: CanvasRenderingContext2D, options: ?DrawOptions) {
    this.context = context;

    // derive the origin using the source canvas width and height
    this.origin = [
      context.canvas.width / 2,
      context.canvas.height / 2
    ];
  }

  static create(options?: CanvasDrawingSurfaceOptions): CanvasDrawingSurface {
    // find a suitable target for the canvas using the following preference order
    // 1. Specified target DOM element (if not a canvas element will error)
    // 2. First element matching the specified selectorx

    let target;
    if (options && options.target) {
      target = options.target;
    } else if (options && options.selector) {
      target = document.querySelector(options.selector);
    } else {
      target = document.getElementsByTagName('canvas')[0];
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
    // set the initial position to the x and y value
    this.context.beginPath();
    this.context.moveTo(
      this.origin[0] + x,
      this.origin[1] + y
    );

    for (let component of path) {
      switch (component.type) {
        case 'M':
          this.context.moveTo(
            this.origin[0] + x + component.position[0],
            this.origin[1] + y + component.position[1]
          );
          break;

        case 'L':
          this.context.lineTo(
            this.origin[0] + x + component.position[0],
            this.origin[1] + y + component.position[1]
          );
          break;

        default:
          throw new Error(`Canvas drawing logic for component type "${component.type} not implemeneted`);
      }
    }

    this.context.stroke();
  }
}

module.exports = {
  CanvasDrawingSurface
};
