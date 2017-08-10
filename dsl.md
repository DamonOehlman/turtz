```
SQUARE size = PD 4(^${size} >90) PU
SQUARE 50 @0:0

POLY sides size = PD ${sides}(^${size} >${360 / sides}) PU
POLY 10 50 @0:0
```

### General Syntax

#### Commands

- `PD` (or `PENDOWN`) - Pen down
- `PU` (pr `PENUP`) - Pen up
- `n(..)` (or `REPEAT:n(..)`) - where n is a digit; repeat the instructions within the brackets `n` times
- `^n` (or `FORWARD:n`) - move forward by `n`
- `>n` (or `ROTATE_RIGHT:n`) - rotate right by `n`
- `<n` (or `ROTATE_LEFT:n`) - rotate left by `n`

#### Function declaration

```
FNNAME ARGS... = INSTRUCTIONS
```

#### Function execution

```
FNNAME ARG_VALUES... @X:Y
```

Execute `FNNAME` with the (space delimited) values `ARG_VALUES` starting at coordinates `X,Y`

