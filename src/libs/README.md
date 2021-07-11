# OffsetGrid

An OffsetGrid describes a two-dimensional number system consisting of rows and columns.  It has a y-axis and an x-axis.

The grid is not intended to have a continuous domain.  The points on both axes are intended to be integers.

The most notable property of the OffsetGrid is that for every row with odd-numbered y-values, the x-value of the coordinate in cartesian space is shifted by 1/2 of a unit.

This is because the intended usage for this project is to display circular content elements, and offsetting every other row in this way allows for optimal circle-packing.

There are a lot of interesting properties with a grid set up in this way, and I hope you'll enjoy the end result as much as I enjoyed exploring this grid system it and figuring out its secrets!