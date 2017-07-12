// @flow

export type Position = [number,number];

const DEGREES_TO_RADIANS = Math.PI / 180;
const RADIANS_TO_DEGREES = 180 / Math.PI;

class Geometry {
  /**
   * Return the angle between position a and b in radians
   */
  static calculateAngle(a: Position, b: Position): number {
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
  }

  static calculateDistance(a: Position, b: Position): number {
    const distX = Math.abs(b[0] - a[0]);
    const distY = Math.abs(b[1] - a[1]);
    return Math.sqrt(distX * distX + distY * distY);
  }

  /**
   * Given a current position, an angle (in radians) and a distance to move from the
   * original position, calculate the target position.
   */
  static moveWithHeading(current: Position, angle: number, distance: number): Position {
    const deltaX = Math.cos(angle) * distance;
    const deltaY = Math.sin(angle) * distance;
    return [ current[0] + deltaX, current[1] + deltaY ]; // .map(to3Decimals);
  }

  static toRadians(degrees: number): number {
    return degrees * DEGREES_TO_RADIANS;
  }

  static toDegrees(radians: number): number {
    return radians * RADIANS_TO_DEGREES;
  }
}

function to3Decimals(a) {
  return Math.floor(a * 1000) / 1000;
}

module.exports = {
  Geometry
};
