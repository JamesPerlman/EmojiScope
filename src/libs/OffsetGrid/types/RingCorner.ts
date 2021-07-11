/* There are 6 ring corners.  Corner 0 is always the start, and they increase counter-clockwisely like so:
    +y
    ^
    |      p2 . p1
    |     .       .
    |    p3       p0
    |     .         .
    |      p4 . . p5
    |
    -----------------> +x
*/

export type RingCorner = 0 | 1 | 2 | 3 | 4 | 5;