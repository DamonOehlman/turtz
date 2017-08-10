// @flow

const { Pen, Move, Rotate } = require('./lib/instructions');
const { CanvasDrawingSurface } = require('./lib/canvas');
const { Surface } = require('./lib/surface');
const { Path } = require('./lib/path');

module.exports = {
  Path,
  CanvasDrawingSurface,
  Surface,
  Pen,
  Move,
  Rotate,
  Turn: Rotate // alias Rotate for an alternative syntax for simpler terminology
};
