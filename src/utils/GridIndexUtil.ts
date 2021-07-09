/*
  This Index util is just for the functions that map between a 1D index and a 2D position on the grid.

  The main difference between this file and GridLayoutUtil is that these functions apply to any grid
  Whereas the layout functions require knowledge of the grid's layout properties.

  At some point the GridUtil files might be combined into one file

  But we only have one type of grid right now, it's a rectangular grid where every odd-indexed row is offset by half a unit.

  So for now all grids will have the same indexToXY and inverse functions.
  */

import { Index2D } from '../types';

// There are six directions (pseudo-axes) a point can move along this shifted grid
export enum GridAxis {
  NX, // negative x
  PX, // positive x
  NXNY, // negative x, negative y
  NXPY, // negative x, positive y
  PXNY, // positive x, negative y
  PXPY, // positive x, positive y
}

/**
 * Translates a point along the grid by a magnitude in a direction
 * @param {Index2D} p - The starting indices to translate from
 * @param {GridAxis} axis - The axis along which to move
 * @param {number} m - The magnitude along the axis to translate by
 *
 * @return {Index2D} - The translated indices
 *
 * I am not sure we are even gonna use this function
 *
 */

/*
**** I AM LIKE 100% SURE THIS FUNCTION IS WRONG ***
*/
const translate = (function () {
  // I like to encapsulate simple convenience functions like this because it's only used inside this translate function and it's very DRY
  // For diagonal moves, if p.y is even we use Math.ceil, and if p.y is odd we use Math.floor
  function dx(py: number, m: number): number {
    if (py % 2 === 0) {
      return Math.ceil(m / 2);
    } else {
      return Math.floor(m / 2);
    }
  }

  // The actual function...
  return (p: Index2D, axis: GridAxis, m: number): Index2D => {
    switch (axis) {
      case GridAxis.NX:
        return { x: p.x - m, y: p.y };
      case GridAxis.PX:
        return { x: p.x + m, y: p.y };
      case GridAxis.NXNY:
        return { x: p.x - dx(p.y, m), y: p.y - m };
      case GridAxis.NXPY:
        return { x: p.x - dx(p.y, m), y: p.y + m };
      case GridAxis.PXNY:
        // this is wrong. see walk function
        return { x: p.x + dx(p.y, m), y: p.y - m };
      case GridAxis.PXPY:
        // this is wrong. see walk function
        return { x: p.x + dx(p.y, m), y: p.y + m };
    }
  };
})();

/**
 * walk along the grid by 1 position along an axis
 * @param {Index2D} p - The starting indices to translate from
 * @param {GridAxis} axis - The axis along which to move
 *
 * @return {Index2D} - The translated indices
 */

const walk = (function () {
  const dx = (py: number) => (py % 2 === 0 ? 1 : 0);

  return (p: Index2D, axis: GridAxis): Index2D => {
    switch (axis) {
      case GridAxis.NX:
        return { x: p.x - 1, y: p.y };
      case GridAxis.PX:
        return { x: p.x + 1, y: p.y };
      case GridAxis.NXNY:
        return { x: p.x - dx(p.y), y: p.y - 1 };
      case GridAxis.NXPY:
        return { x: p.x - dx(p.y), y: p.y + 1 };
      case GridAxis.PXNY:
        return { x: p.x + 1 - dx(p.y), y: p.y - 1 };
      case GridAxis.PXPY:
        return { x: p.x + 1 - dx(p.y), y: p.y + 1 };
    }
  };
})();

const indexToXY = (function () {
  const ringNumNodes = (n: number): number => 6 * n + 1;
  const ringStartPoint = (n: number): Index2D => ({ x: n, y: 0 });
  const ringEndPoint = (n: number): Index2D => ({ x: n + 1, y: 0 });

  return (index: number): Index2D => {
    let p: Index2D = { x: 0, y: 0 };
    if (index === 0) {
      return p;
    }

    let n = 1; // ring index
    let i = 1;
    // iterate through rings
    while (true) {
      // make the appropriate pattern of moves until index is reached

      // walk NXPY n times
      for (let j = 1; j < n; ++j) {
        p = walk(p, GridAxis.NXPY);
        if (++i > index) return p;
      }

      // walk NX n times
      for (let j = 1; j < n; ++j) {
        p = walk(p, GridAxis.NX);
        if (++i > index) return p;
      }

      // walk NXNY n times
      for (let j = 1; j < n; ++j) {
        p = walk(p, GridAxis.NXNY);
        if (++i > index) return p;
      }

      // walk PXNY n times
      for (let j = 1; j < n; ++j) {
        p = walk(p, GridAxis.PXNY);
        if (++i > index) return p;
      }

      // walk PX n+1 times
      for (let j = 1; j < n + 1; ++j) {
        p = walk(p, GridAxis.PX);
        if (++i > index) return p;
      }

      // walk PXPY n items
      for (let j = 1; j < n; ++j) {
        p = walk(p, GridAxis.PXPY);
        if (++i > index) return p;
      }

      // increment ring index
      ++n;
      // walk over to start of next ring
    }
  };
})();


export const GridIndexUtil = {
  indexToXY,
};
