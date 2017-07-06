// @flow

const { Pen, Move, Rotate } = require('./lib/instructions');
const { CanvasDrawingSurface } = require('./lib/canvas');
const { Application } = require('./lib/application');
const { Path } = require('./lib/path');

module.exports = {
  Path,
  CanvasDrawingSurface,
  Application,
  Pen,
  Move,
  Rotate,
  Turn: Rotate // alias Rotate for an alternative syntax for simpler terminology
};
