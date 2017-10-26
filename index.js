// @flow

const { Pen, Move, Rotate } = require('./lib/instructions');
const { Canvas } = require('./lib/canvas');
const { Path } = require('./lib/path');
const { Commands } = require('./lib/commands');

/**

# Turtz

I remember when I was a kid playing alot with
[Logo](https://en.wikipedia.org/wiki/Logo_(programming_language)). You can actually
take a trip down memory lane thanks to an Apple II emulator written in JS:

<https://www.scullinsteel.com/apple2/#logo>

After I did this, I found that I was probably remembering my experiences better than
it actually was. So I set about thinking what a modern equivalent might look like. I
decided it should have the following attributes:

1. Demonstrate some elements of functional programming:

  - Create lists of steps rather than a set of procedural commands.
  - Support composability through the ability to define a function which produces
    a series of steps, and be able to invoke that command within another series of
    instructions.

2. Seek to simple geometry.

3. Create a "render" system agnostic way of demonstrating how the instructions are
   executed. At present, only a 2D canvas renderer is supported, however, I believe
   this could easily be extended to other graphical formats and potentially even to
   something like [NodeBots](http://nodebots.io/).

## Code Example

The following is a rather long code sample, that I'll break into smaller parts in
the future:

<<< demo/friendly.js

This generates the following output:

![](docs/images/turtz-friendly-sample.gif)

**/

module.exports = {
  Commands,
  Path,
  Canvas,
  Pen,
  Move,
  Rotate,
  Turn: Rotate // alias Rotate for an alternative syntax for simpler terminology
};
