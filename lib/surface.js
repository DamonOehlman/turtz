// @flow

const {
  CanvasDrawingSurface
} = require('./canvas');


const { Path } = require('./path');

import type {
  PathComponent,
  PathOrInstructions
} from './path';

import type {
  Instruction
} from './instructions';

export type StartLoopData = {
  delta: number
};

export type SurfaceDrawResult = {
  done: boolean
};

export interface DrawingSurface {
  // TODO: workout how to flag a parameter as having a default value without providing the value
  draw(input: PathOrInstructions, x: number, y: number): ?SurfaceDrawResult;

  // instructions to prepare and finalize the surface during a animation cycle
  startLoop(options: StartLoopData): void;
  finishLoop(): void;
}

type SurfaceCreateOptions = {
  surface?: DrawingSurface
};

type DrawLoop = {
  delta: number
};

type DrawLoopResult = Array<?SurfaceDrawResult>;

// application loop defines a function that receives the surface instance
// this occurs within a request animation frame so that animation can be
// performed on the surface if supported
type DrawLoopHandler = (surface: DrawingSurface, data: DrawLoop) => ?DrawLoopResult;

class Surface {
  static create(options: SurfaceCreateOptions, loopHandler: DrawLoopHandler) {
    const surface: DrawingSurface = options.surface || Surface.createDefault(options);
    let lastTick = 0;

    const loop = (timestamp) => {
      const delta = Math.floor(timestamp - lastTick);
      lastTick = timestamp;

      // if the delta is outside of tolerance, skip this frame
      if (delta > 100) {
        window.requestAnimationFrame(loop);
        return;
      }

      surface.startLoop({ delta });
      try {
        const results: DrawLoopResult = loopHandler(surface, { delta }) || [];
        const done = results.filter(result => result && result.done).length === results.length;
        if (!done) {
          window.requestAnimationFrame(loop);
        }
      } finally {
        surface.finishLoop();
      }
    };

    window.requestAnimationFrame(loop);
  }

  static createDefault(options: SurfaceCreateOptions): DrawingSurface {
    const canvas = document.createElement('canvas');
    if (document.body) {
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
      document.body.appendChild(canvas);

      // TODO: handle canvas resizes
    }

    return CanvasDrawingSurface.create({ target: canvas });
  }
}

module.exports = {
  Surface
};
