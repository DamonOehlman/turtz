// @flow

class Animator {
  static async nextFrame(fps: number, lastTick: number): Promise<number> {
    const requiredDelta = Math.floor(1000 / fps);
    const delta = Date.now() - lastTick;

    while (Date.now() - lastTick < requiredDelta) {
      await Animator.nextAnimationFrame();
    }

    return Date.now() - lastTick;
  }

  static async nextAnimationFrame(): Promise<number> {
    return new Promise(resolve => window.requestAnimationFrame(resolve));
  }
}

module.exports = {
  Animator
};
