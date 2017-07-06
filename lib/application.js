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

// application loop defines a function that receives the surface instance
// this occurs within a request animation frame so that animation can be
// performed on the surface if supported
type ApplicationLoop = (surface: DrawingSurface) => ?boolean;

class Application {
  static create(options: ApplicationOptions, appLoop: ApplicationLoop) {
    const surface: DrawingSurface = options.surface || Application.createDefaultSurface(options);
    const animationReference = window.requestAnimationFrame(() => {
      surface.startLoop(0);
      try {
        // run the app loop
        // if we have been instructed to cancel clear the request animation frame
        if (appLoop(surface)) {
          window.cancelAnimationFrame(animationReference);
        }
      } finally {
        surface.finishLoop();
      }
    });
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
