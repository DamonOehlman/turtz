// @flow

const { Path } = require('./path');
const { Geometry } = require('./geometry');

import type {
  PathComponent,
  PathOrInstructions
} from './path';

import type {
  Position
} from './geometry';

import type {
  StartLoopData,
  SurfaceDrawResult
} from './surface';

export type DrawOptions = {
  turtleImage: ?Image
};

export type CanvasDrawingSurfaceOptions = {
  selector?: string,
  target?: HTMLElement,
  drawOptions?: DrawOptions
};

class CanvasDrawingSurface {
  context: CanvasRenderingContext2D;
  origin: Position;
  elapsed: number;

  constructor(context: CanvasRenderingContext2D, options: ?DrawOptions) {
    this.context = context;

    // derive the origin using the source canvas width and height
    this.origin = [
      context.canvas.width / 2,
      context.canvas.height / 2
    ];

    this.elapsed = 0;
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

  draw(input: PathOrInstructions, x: number, y: number): SurfaceDrawResult {
    const path = Path.ensurePath(input);

    // calcualate the length to draw for a 2s animation
    const lengthToDraw = path.length * (this.elapsed / 5e3);

    let lastHeading = 0;
    let lengthDrawn = 0;
    let lastPosition: Position = [x, y];

    // set the initial position to the x and y value
    this.context.beginPath();
    this.context.moveTo(
      this.origin[0] + x,
      this.origin[1] + y
    );

    path.components.forEach((component, index) => {
      let lengthFromLast = 0;
      let targetPosition = component.position;

      // if the length drawn already exceeds the length to draw do nothing
      if (lengthDrawn >= lengthToDraw) {
        return;
      }

      lengthFromLast = Geometry.calculateDistance(lastPosition, component.position);

      // if drawing this line would push us over the length to draw
      // then update the target position
      if (lengthFromLast + lengthDrawn > lengthToDraw) {
        targetPosition = Geometry.moveWithHeading(
          lastPosition,
          Geometry.calculateAngle(lastPosition, component.position),
          lengthToDraw - lengthDrawn
        );
      }

      switch (component.type) {
        case 'M':
          this.context.moveTo(
            this.origin[0] + x + targetPosition[0],
            this.origin[1] + y + targetPosition[1]
          );
          break;

        case 'L':
          this.context.lineTo(
            this.origin[0] + x + targetPosition[0],
            this.origin[1] + y + targetPosition[1]
          );
          break;

        default:
          throw new Error(`Canvas drawing logic for component type "${component.type} not implemeneted`);
      }

      // update last heading and position
      lastHeading = Geometry.calculateAngle(targetPosition, lastPosition);
      lengthDrawn += Geometry.calculateDistance(lastPosition, targetPosition);
      lastPosition = targetPosition; // TODO: clone
    });

    this.context.stroke();

    // draw the turtle arrow head
    if (lastPosition) {
      this.drawTurtle(lastHeading, lastPosition);
    }

    console.log('drawing');
    return { done: lengthDrawn >= path.length };
  }

  startLoop(options: StartLoopData) {
    // increment the elapsed tick count by the delta
    this.elapsed += options.delta;

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

  drawTurtle(heading: number, position: Position) {
    this.context.save();
    try {
      this.context.translate(this.origin[0] + position[0], this.origin[1] + position[1]);
      this.context.rotate(heading);
      this.context.beginPath();
      try {
        this.context.moveTo(0, 0);
        this.context.lineTo(10, -5);
        this.context.lineTo(10, 5);
      } finally {
        this.context.fill();
      }
      // this.context.fillRect(0, -5, 10, 10);
    } finally {
      this.context.restore();
    }
  }
}

module.exports = {
  CanvasDrawingSurface
};
