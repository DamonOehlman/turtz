// @flow

const { Pen, Move, Rotate } = require('./lib/instructions');
const { Turtle } = require('./lib/turtle');
const { CanvasDrawingSurface } = require('./lib/canvas');

module.exports = {
  Turtle,
  CanvasDrawingSurface,
  Pen,
  Move,
  Rotate,
  Turn: Rotate // alias Rotate for an alternative syntax for simpler terminology
};
