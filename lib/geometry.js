// @flow

export type Position = [number,number];

const DEGREES_TO_RADIANS = Math.PI / 180;

class Geometry {
  static moveWithHeading(current: Position, heading: number, distance: number): Position {
    const deltaX = Math.cos(heading * DEGREES_TO_RADIANS) * distance;
    const deltaY = Math.sin(heading * DEGREES_TO_RADIANS) * distance;
    return [ current[0] + deltaX, current[1] + deltaY ];
  }
}

module.exports = {
  Geometry
};
