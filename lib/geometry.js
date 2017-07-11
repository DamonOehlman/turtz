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

  static moveWithHeading(current: Position, heading: number, distance: number): Position {
    const deltaX = Math.cos(heading * DEGREES_TO_RADIANS) * distance;
    const deltaY = Math.sin(heading * DEGREES_TO_RADIANS) * distance;
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
