// @flow

const { Pen, Move, Rotate } = require('./lib/commands');

module.exports = {
  Turtle: require('./lib/turtle'),
  Pen,
  Move,
  Rotate,
  Turn: Rotate // alias Rotate for an alternative syntax for simpler terminology
};
