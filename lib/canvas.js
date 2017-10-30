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

export type CanvasContructorOptions = {
  turtleImage?: Image,
  retainDrawn: boolean
};

export type CanvasFactoryOptions = {
  selector?: string,
  target?: HTMLElement,
  scope?: HTMLElement, // defaults to document
  retainDrawn?: boolean
};

export type CanvasDrawOptions = {
  x: number,
  y: number,
  speed?: number,
  previousPaths?: Array<CanvasPath>
};

type PathDrawState = {
  elapsed?: number,
  completed: boolean
};

type PathDrawOptions = {
  origin: Position,
  path: Path,
  x: number,
  y: number,
  speed: number
};

type FindTargetOptions = {
  selector?: string,
  target?: HTMLElement,
  scope?: HTMLElement
};

class Canvas {
  context: CanvasRenderingContext2D;
  origin: Position;
  previousPaths: ?Array<CanvasPath>;
  retainDrawn: boolean;

  constructor(context: CanvasRenderingContext2D, options: CanvasContructorOptions) {
    this.context = context;

    // derive the origin using the source canvas width and height
    this.origin = [
      context.canvas.width / 2,
      context.canvas.height / 2
    ];
    
    if (options && !!options.retainDrawn) {
      this.previousPaths = [];
    }
  }

  static create(options: ?CanvasFactoryOptions): Promise<Canvas> {
    let target = options ? Canvas.findTargetForOptions(options) : null;
    if (target == undefined) {
      target = Canvas.createDefault2DCanvas();
    }

    const context = target.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D rendering context for canvas element');
    }
    
    return Promise.resolve(new Canvas(context, {
      retainDrawn: options ? !!options.retainDrawn : true
    }));
  }

  static findTargetForOptions({ target, selector, scope }: FindTargetOptions): ?HTMLCanvasElement {
    if (target) {
      if (target instanceof HTMLCanvasElement) {
        return target;
      }

      throw new Error('target specified for canvas was not a canvas element');
    } else if (selector) {
      const selectedTarget = (scope || document).querySelector(selector);
      if (selectedTarget && selectedTarget instanceof HTMLCanvasElement) {
        return selectedTarget;
      }

      throw new Error('specified selector does not target a canvas element');
    }

    return null;
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

  async draw(input: PathOrInstructions, opts: ?CanvasDrawOptions): Promise<CanvasPath> {
    const path = Path.ensurePath(input);
    const canvasPath = new CanvasPath({
      origin: this.origin,
      path,
      x: opts ? opts.x || 0 : 0,
      y: opts ? opts.y || 0 : 0,
      speed: opts ? opts.speed || DEFAULT_SPEED : DEFAULT_SPEED
    });

    const turtle = new CanvasTurtle({
      origin: this.origin
    });

    let state = { completed: false };
    while (!state.completed) {
      const tick = Date.now();
      const delta = await Animator.nextFrame(60, tick);
      Canvas.reset(this.context, this.origin);
      
      // draw the previous paths
      if (this.previousPaths) {
        this.previousPaths.forEach(previousPath => {
          previousPath.draw(this.context, turtle, 0, { completed: true });
        });
      }

      state = await canvasPath.draw(this.context, turtle, delta, state);
    }

    if (this.previousPaths) {
      this.previousPaths.push(canvasPath);
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
  totalTime: number;
  
  constructor({ origin, path, x, y, speed }: PathDrawOptions) {
    this.origin = origin;
    this.components = path.components.slice();
    this.length = path.length;
    this.x = x;
    this.y = y;
    this.totalTime = Math.floor(path.length / speed) * 1000;
  }

  draw(
    context: CanvasRenderingContext2D,
    turtle: ?CanvasTurtle,
    delta: number,
    state: PathDrawState
  ): PathDrawState {
    const newState = {
      elapsed: state.completed ? this.totalTime : (state.elapsed || 0) + delta,
      completed: state.completed
    };

    // determine the actual path origin
    // this is the origin.x + x, and the origin.y - y
    // as we want the negative y values to appear below the horizontal axis
    const origin = Geometry.translate(this.origin, this.x, -this.y);

    // determine the length to draw in this draw routine
    const lengthToDraw = this.length * (newState.elapsed / this.totalTime);
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
    newState.completed = lengthDrawn >= this.length;
    return newState;
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
