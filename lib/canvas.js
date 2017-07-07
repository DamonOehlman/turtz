// @flow

const { Path } = require('./path');

import type {
  PathComponent,
} from './path';

import type {
  Position
} from './geometry';

import type {
  StartLoopData
} from './surface';

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
  delta: number;

  constructor(context: CanvasRenderingContext2D, options: ?DrawOptions) {
    this.context = context;

    // derive the origin using the source canvas width and height
    this.origin = [
      context.canvas.width / 2,
      context.canvas.height / 2
    ];

    this.delta = 0;
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

  draw(path: Path, x: number, y: number): void {
    // set the initial position to the x and y value
    this.context.beginPath();
    this.context.moveTo(
      this.origin[0] + x,
      this.origin[1] + y
    );

    for (let component of path.components) {
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

  startLoop(options: StartLoopData) {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );

    this.context.beginPath();
    this.context.moveTo(0, this.origin[1]);
    this.context.lineTo(this.context.canvas.width, this.origin[1]);
    this.context.moveTo(this.origin[0], 0);
    this.context.lineTo(this.origin[0], this.context.canvas.height);

    this.context.save();
    try {
      this.context.lineWidth = 3;
      this.context.strokeStyle = 'rgba(255, 0, 0, 0.2)';
      this.context.stroke();
    } finally {
      this.context.restore();
    }
  }

  finishLoop() {
  }
}

module.exports = {
  CanvasDrawingSurface
};
