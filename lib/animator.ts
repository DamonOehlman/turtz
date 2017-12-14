export class Animator {
  static async nextFrame(fps: number, lastTick: number): Promise<number> {
    const requiredDelta = Math.floor(1000 / fps);
    let currentTick;

    do {
      currentTick = await Animator.nextAnimationFrame();
    } while (currentTick - lastTick < requiredDelta);

    return currentTick - lastTick;
  }

  static async nextAnimationFrame(): Promise<number> {
    return new Promise(resolve => window.requestAnimationFrame(resolve));
  }
}
