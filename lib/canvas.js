// @flow

const { Path } = require('./path');
const { Geometry } = require('./geometry');

const DEFAULT_SPEED: number = 150;

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

  constructor(context: CanvasRenderingContext2D, options: ?DrawOptions) {
    this.context = context;

    // derive the origin using the source canvas width and height
    this.origin = [
      context.canvas.width / 2,
      context.canvas.height / 2
    ];
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

  static createDefault2DCanvas() {
    const canvas = document.createElement('canvas');
    if (document.body) {
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
      document.body.appendChild(canvas);
    }

    return canvas;
  }

  draw(
    input: PathOrInstructions,
    x: number = 0,
    y: number = 0,
    speed: number = DEFAULT_SPEED
  ): Promise<this> {
    const path = Path.ensurePath(input);
    const canvasPath = new CanvasPath({
      origin: this.origin,
      path,
      x,
      y,
      speed
    });

    return new Promise(resolve => {
      window.requestAnimationFrame(() => this.drawPath(canvasPath, resolve));
    });
  }

  drawPath(path: CanvasPath, resolve: (this) => void, lastTick: ?number): void {
    if (!lastTick) {
      window.requestAnimationFrame(() => this.drawPath(path, resolve, Date.now()));
      return;
    }

    this.nextFrame(60, Date.now() - lastTick).then(delta => {
      try {
        this.startLoop();
        path.draw(this.context, delta).then(done => {
          if (!done) {
            window.requestAnimationFrame(() => this.drawPath(path, resolve, lastTick || Date.now()));
            return;
          }
  
          resolve(this);
        });
      } finally {
        this.finishLoop();
      }
    });
  }

  startLoop() {
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

  nextFrame(fps: number, lastTick: number): Promise<number> {
    const requiredDelta = 1000 / fps;
    const delta = Date.now() - lastTick;
    
    if (delta >= requiredDelta) {
      return Promise.resolve(delta);
    }

    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        this.nextFrame(fps, lastTick);
      });
    })
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
  lastPosition: Position;
  lengthDrawn: number;
  lastHeading: number;
  
  constructor({ origin, path, x, y, speed }: PathDrawOptions) {
    this.origin = origin;
    this.components = path.components.slice();
    this.length = path.length;
    this.x = x;
    this.y = y;

    this.elapsed = 0;
    this.totalTime = Math.floor(path.length / speed) * 1000;
    this.lastPosition = [0, 0];
    this.lengthDrawn = 0;
    this.lastHeading = 0;
  }

  draw(context: CanvasRenderingContext2D, delta: number): Promise<boolean> {
    this.elapsed += delta;
    console.log('drawing');

    // determine the actual path origin
    // this is the origin.x + x, and the origin.y - y
    // as we want the negative y values to appear below the horizontal axis
    const origin = Geometry.translate(this.origin, this.x, -this.y);

    // determine the length to draw in this draw routine
    const lengthToDraw = this.length * (this.elapsed / this.totalTime);
    debugger;
    
    // set the initial position to the x and y value
    context.beginPath();
    context.moveTo(origin[0], origin[1]);

    this.components.forEach((component, index) => {
      let lengthFromLast = 0;
      let targetPosition = component.position;

      // if the length drawn already exceeds the length to draw do nothing
      if (this.lengthDrawn >= lengthToDraw) {
        return;
      }

      lengthFromLast = Geometry.calculateDistance(this.lastPosition, component.position);

      // if drawing this line would push us over the length to draw
      // then update the target position
      if (lengthFromLast + this.lengthDrawn > lengthToDraw) {
        targetPosition = Geometry.moveWithHeading(
          this.lastPosition,
          Geometry.calculateAngle(this.lastPosition, component.position),
          lengthToDraw - this.lengthDrawn
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

      // update last heading and position
      this.lastHeading = Geometry.calculateAngle(targetPosition, this.lastPosition);
      this.lengthDrawn += Geometry.calculateDistance(this.lastPosition, targetPosition);
      this.lastPosition = targetPosition; // TODO: clone
    });

    context.stroke();

    // draw the turtle arrow head
    if (this.lastPosition) {
      this.drawTurtle(context, this.lastHeading);
    }

    console.log(this.lengthDrawn >= lengthToDraw);
    return Promise.resolve(this.lengthDrawn >= lengthToDraw);
  }

  drawTurtle(context: CanvasRenderingContext2D, heading: number) {
    const position = Geometry.translate(this.lastPosition, this.x, -this.y);

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
