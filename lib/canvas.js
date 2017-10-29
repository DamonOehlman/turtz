// @flow

const { Path } = require('./path');
const { Geometry } = require('./geometry');
const { Animator } = require('./animator');

const DEFAULT_SPEED: number = 150;

import type {
  PathComponent,
  PathOrInstructions
} from './path';

import type {
  Position
} from './geometry';

export type DrawOptions = {
  turtleImage: ?Image
};

export type CanvasDrawingSurfaceOptions = {
  selector?: string,
  target?: HTMLElement,
  drawOptions?: DrawOptions
};

export type CanvasDrawOptions = {
  x: number,
  y: number,
  speed?: number,
  previousPaths?: Array<CanvasPath>
};

type PathDrawOptions = {
  origin: Position,
  path: Path,
  x: number,
  y: number,
  speed: number
};

class Canvas {
  context: CanvasRenderingContext2D;
  origin: Position;
  previousPaths: Array<CanvasPath>;

  constructor(context: CanvasRenderingContext2D, options: ?DrawOptions) {
    this.context = context;

    // derive the origin using the source canvas width and height
    this.origin = [
      context.canvas.width / 2,
      context.canvas.height / 2
    ];

    this.previousPaths = [];
  }

  static create(options?: CanvasDrawingSurfaceOptions): Promise<Canvas> {
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

    if (target == undefined) {
      target = Canvas.createDefault2DCanvas();
    }

    if (!(target instanceof HTMLCanvasElement)) {
      throw new Error('A canvas drawing surface must be provided a valid canvas target');
    }

    const context = target.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D rendering context for canvas element');
    }
    
    return Promise.resolve(new Canvas(context, options && options.drawOptions));
  }

  static createDefault2DCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    if (document.body) {
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
      document.body.appendChild(canvas);
    }

    return canvas;
  }

  async draw(input: PathOrInstructions, { x, y, speed, previousPaths }: CanvasDrawOptions): Promise<CanvasPath> {
    const path = Path.ensurePath(input);
    const canvasPath = new CanvasPath({
      origin: this.origin,
      path,
      x,
      y,
      speed: speed || DEFAULT_SPEED
    });

    const turtle = new CanvasTurtle({
      origin: this.origin
    });

    while (!canvasPath.completed) {
      const tick = Date.now();
      const delta = await Animator.nextFrame(60, tick);
      Canvas.reset(this.context, this.origin);
      
      // draw the previous paths
      if (previousPaths) {
        previousPaths.forEach(previousPath => previousPath.draw(this.context, turtle, 0));
      }

      await canvasPath.draw(this.context, turtle, delta);
    }

    return canvasPath;
  }

  static reset(context: CanvasRenderingContext2D, origin: Position) {
    context.clearRect(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );

    context.beginPath();
    context.moveTo(0, origin[1]);
    context.lineTo(context.canvas.width, origin[1]);
    context.moveTo(origin[0], 0);
    context.lineTo(origin[0], context.canvas.height);

    context.save();
    try {
      context.lineWidth = 3;
      context.strokeStyle = 'rgba(255, 0, 0, 0.2)';
      context.stroke();
    } finally {
      context.restore();
    }
  }
}

class CanvasPath {
  origin: Position;
  components: Array<PathComponent>;
  length: number;
  x: number;
  y: number;
  speed: number;

  elapsed: number;
  totalTime: number;
  completed: boolean;
  
  constructor({ origin, path, x, y, speed }: PathDrawOptions) {
    this.origin = origin;
    this.components = path.components.slice();
    this.length = path.length;
    this.x = x;
    this.y = y;

    this.elapsed = 0;
    this.totalTime = Math.floor(path.length / speed) * 1000;
    this.completed = false;
  }

  draw(context: CanvasRenderingContext2D, turtle: ?CanvasTurtle, delta: number): void {
    this.elapsed += delta;

    console.log('drawing', delta, this.elapsed);

    // determine the actual path origin
    // this is the origin.x + x, and the origin.y - y
    // as we want the negative y values to appear below the horizontal axis
    const origin = Geometry.translate(this.origin, this.x, -this.y);

    // determine the length to draw in this draw routine
    const lengthToDraw = this.length * (this.elapsed / this.totalTime);
    let lengthDrawn: number  = 0;
    let lastHeading: number = 0;
    let lastPosition: Position = [0, 0];
    
    // set the initial position to the x and y value
    context.beginPath();
    context.moveTo(origin[0], origin[1]);
    this.components.forEach((component, index) => {
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
          context.moveTo(
            origin[0] + targetPosition[0],
            origin[1] + targetPosition[1]
          );
          break;

        case 'L':
          context.lineTo(
            origin[0] + targetPosition[0],
            origin[1] + targetPosition[1]
          );
          break;

        default:
          throw new Error(`Canvas drawing logic for component type "${component.type} not implemeneted`);
      }

      // update last heading and positio
      lastHeading = Geometry.calculateAngle(targetPosition, lastPosition);
      lengthDrawn += Geometry.calculateDistance(lastPosition, targetPosition);
      lastPosition = targetPosition; // TODO: clone
    });

    context.stroke();

    // draw the turtle arrow head
    turtle && turtle.draw(context, lastHeading, lastPosition, this.x, this.y);
    this.completed = lengthDrawn >= this.length;
  }

}

class CanvasTurtle {
  origin: Position;

  constructor({ origin }) {
    this.origin = origin;
  }

  draw(context: CanvasRenderingContext2D, heading: number, lastPosition: Position, x: number, y: number) {
    const position = Geometry.translate(lastPosition, x, -y);

    context.save();
    try {
      context.translate(this.origin[0] + position[0], this.origin[1] + position[1]);
      context.rotate(heading);
      context.beginPath();
      try {
        context.moveTo(0, 0);
        context.lineTo(10, -5);
        context.lineTo(10, 5);
      } finally {
        context.fill();
      }
      // this.context.fillRect(0, -5, 10, 10);
    } finally {
      context.restore();
    }
  }
}

module.exports = {
  Canvas
};
