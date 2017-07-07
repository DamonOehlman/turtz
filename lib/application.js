// @flow

const {
  CanvasDrawingSurface
} = require('./canvas');

import type {
  DrawingSurface
} from './surface';

type ApplicationOptions = {
  surface?: DrawingSurface
};

type ApplicationLoopData = {
  delta: number
};

type ApplicationLoopResult = {
  cancel: boolean
};

// application loop defines a function that receives the surface instance
// this occurs within a request animation frame so that animation can be
// performed on the surface if supported
type ApplicationLoop = (surface: DrawingSurface, data: ApplicationLoopData) => ?ApplicationLoopResult;

class Application {
  static create(options: ApplicationOptions, appLoop: ApplicationLoop) {
    const surface: DrawingSurface = options.surface || Application.createDefaultSurface(options);
    let lastTick = 0;

    const loop = (timestamp) => {
      const delta = Math.floor(timestamp - lastTick);
      lastTick = timestamp;

      // if the delta is outside of tolerance, skip this frame
      if (delta > 100) {
        window.requestAnimationFrame(loop);
        return;
      }

      surface.startLoop(0);
      try {
        const { cancel } = appLoop(surface, { delta }) || { cancel: false };
        if (!cancel) {
          window.requestAnimationFrame(loop);
        }
      } finally {
        surface.finishLoop();
      }
    };

    window.requestAnimationFrame(loop);
  }

  static createDefaultSurface(options: ApplicationOptions): DrawingSurface {
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
  Application
};
