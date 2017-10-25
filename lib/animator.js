// @flow

class Animator {
  static nextFrame(fps: number, lastTick: number): Promise<number> {
    const requiredDelta = Math.floor(1000 / fps);
    const delta = Date.now() - lastTick;
    
    if (delta >= requiredDelta) {
      return Promise.resolve(delta);
    }

    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        Animator.nextFrame(fps, lastTick).then(elapsed => resolve(elapsed));
      });
    })
  }
}

module.exports = {
  Animator
};
