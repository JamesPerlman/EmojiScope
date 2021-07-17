import React, { useCallback, useMemo, useState } from 'react';
import Measure, { BoundingRect, ContentRect } from 'react-measure';

import { ReactiveGridItem } from './ReactiveGridItem';

import 'tailwindcss/tailwind.css';
import { createMagnificationEffect } from '../../../types/ItemStyleEffect';
import {
  createShiftedGrid,
  ShiftedGrid,
  Point2D,
  Index2D,
  Scale2D,
  Size2D,
  cartToGrid,
  normalize2D,
  gridCoordToIndex,
} from '../../../libs';
import { useDragDisplacement } from '../../../hooks';
import { getGridQuadrant } from '../../../libs/ShiftedGrid/utils/QuadrantUtil';
import { MousePositionContextProvider } from '../../../contexts';

interface ReactiveGridProps<T> {
  itemRadius: number;
  itemSpacing: number;
  magnification: number;
  effectRadius: number;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactElement | null;
}

/*
 I would love to make ReactiveGridElement a React.FC, however since there are generic types associated with ReactiveGridProps we cannot do this.
 There are some good resources here for why this needs to be done this way https://wanago.io/2020/03/09/functional-react-components-with-generic-props-in-typescript/
 It's just a limitation of typescript.  Here's another good resource: https://stackoverflow.com/questions/53958028/how-to-use-generics-in-props-in-react-in-a-functional-component

 Because of the way we will use ReactiveGrid in this project, this method will work, albeit a bit more confusing and verbose should we need to match the exact functionality of React.FC in the future
 */

const bgAlpha = 0.5;
const quadrantBGs = [
  `rgba(255,0,0,${bgAlpha})`,
  `rgba(255, 255, 0, ${bgAlpha})`,
  `rgba(255, 0, 255, ${bgAlpha})`,
  `rgba(0, 255, 255, ${bgAlpha})`,
  `rgba(0, 255, 0, ${bgAlpha})`,
  `rgba(0, 0, 255, ${bgAlpha})`,
];

function getBoundingRectCenter(rect: BoundingRect): Point2D {
  return {
    x: 0.5 * (rect.left + rect.right),
    y: 0.5 * (rect.top + rect.bottom),
  };
}

function getScaledBoundingRect(rect: BoundingRect, scale: Scale2D): BoundingRect {
  const center = getBoundingRectCenter(rect);
  return {
    width: scale.x * rect.width,
    height: scale.y * rect.height,
    top: scale.y * (rect.top - center.y),
    left: scale.x * (rect.left - center.x),
    bottom: scale.y * (rect.bottom - center.y),
    right: scale.x * (rect.right - center.x),
  };
}

function getNormalizedBoundingRect(rect: BoundingRect, gridSize: Size2D): BoundingRect {
  const inverseScale: Scale2D = {
    x: 1 / gridSize.width,
    y: 1 / gridSize.height,
  };
  return getScaledBoundingRect(rect, inverseScale);
}

const ReactiveGridElement: <T>(props: ReactiveGridProps<T>) => React.ReactElement = (props) => {
  // destructure props
  const { itemRadius, itemSpacing, magnification, effectRadius } = props;

  /* HOOKS */
  const dragDisplacement = useDragDisplacement();

  // state vars
  const [gridCenter, setGridCenter] = useState<Point2D>({ x: 0, y: 0 });
  const [windowedBounds, setGridBounds] = useState<BoundingRect>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
  });

  // callbacks

  // when the grid changes size we need to update its center
  const handleResize = useCallback((info: ContentRect) => {
    const { bounds } = info;
    if (bounds !== undefined) {
      setGridCenter(getBoundingRectCenter(bounds));
      setGridBounds(bounds);
    }
  }, []);

  // when item spacing or item radius changes, we need to recreate the grid math functions
  const grid: ShiftedGrid = useMemo(
    () => createShiftedGrid(itemRadius, itemSpacing, gridCenter),
    [itemRadius, itemSpacing, gridCenter],
  );

  // calculate scrollOffset
  const scrollOffset: Point2D = useMemo(() => dragDisplacement, [dragDisplacement]);
  const scaledScrollOffset = useMemo(
    () => normalize2D(scrollOffset, grid.unitSize),
    [grid.unitSize, scrollOffset],
  );

  const normalizedScrollOffset: Point2D = useMemo(
    () => ({
      x: Math.floor(scrollOffset.x / grid.unitSize.width),
      y: Math.floor(scrollOffset.y / grid.unitSize.height),
    }),
    [scrollOffset, grid],
  );

  /*
  // Not sure why this is still here
  const gridOffset: Point2D = useMemo(() => {
    const xOffset = 0.5 * MathUtil.modulo(normalizedScrollOffset.y, 2);
    return {
      x: scrollOffset.x - grid.unitSize.width * (Math.floor(normalizedScrollOffset.x) + xOffset),
      y: scrollOffset.y - grid.unitSize.height * Math.floor(normalizedScrollOffset.y),
    };
  }, [grid.unitSize, scrollOffset, normalizedScrollOffset]);
  */
  /* GRID LAYOUT VARS */
  /*
  also gonna be honest, don't remember why this is here
  const numberOfItemsPerAxis: XYNumeric = useMemo(
    () => ({
      x: Math.floor(windowedBounds.width / grid.unitSize.width),
      y: Math.floor(windowedBounds.height / grid.unitSize.height),
    }),
    [grid, windowedBounds],
  );
  */

  const gridCoordsInWindowedScrollArea: Index2D[] = useMemo(() => {
    // Define some useful constants
    const scaledWindowedBounds = getNormalizedBoundingRect(windowedBounds, grid.unitSize);
    const ceilOfWidth = Math.ceil(scaledWindowedBounds.width);
    const ceilOfHeight = Math.ceil(scaledWindowedBounds.height);
    const ceilOfWidthPlusOne = ceilOfWidth + 1;
    const ceilOfHeightPlusOne = ceilOfHeight + 1;

    // Use a double-nested loop to collect the gridCoords we need to show inside this windowed scroll area
    const gridCoords: Index2D[] = [];

    for (let x = -1; x < ceilOfWidthPlusOne; ++x) {
      for (let y = -1; y < ceilOfHeightPlusOne; ++y) {
        // Get the cartesian point of this (x, y) coord inside the windowed scroll area
        const cartPoint = {
          x: x - 0.5 * ceilOfWidth - scaledScrollOffset.x,
          y: y - 0.5 * ceilOfHeight - scaledScrollOffset.y,
        };
        // Convert the cartPoint to a gridPoint
        const gridCoord = cartToGrid(cartPoint);

        // Add it to our gridCoords array
        gridCoords.push(gridCoord);
      }
    }
    return gridCoords;
  }, [grid, windowedBounds, scrollOffset]);

  /* ItemStyleEffects */
  const effects = useMemo(() => {
    const magnify = createMagnificationEffect(effectRadius, magnification);
    return [magnify];
  }, [effectRadius, magnification]);

  /* DYNAMIC STYLES */
  /* RENDER */
  return (
    <MousePositionContextProvider>
      <Measure bounds onResize={handleResize}>
        {({ measureRef }) => (
          <>
            <div ref={measureRef} className="w-full h-full bg-gray-600">
              {gridCoordsInWindowedScrollArea.map((gridCoord: Index2D) => {
                const index = gridCoordToIndex(gridCoord);
                return (
                  <ReactiveGridItem
                    key={`item_${index}`}
                    grid={grid}
                    index={index}
                    effects={effects}
                    gridOffset={scrollOffset}>
                    <div
                      style={{
                        backgroundColor: quadrantBGs[getGridQuadrant(gridCoord)],
                        width: `${grid.unitSize.width - 5}px`,
                        height: `${grid.unitSize.height - 5}px`,
                        fontSize: 11,
                      }}>
                      index: {index} <br />
                      coord: (x: {gridCoord.x}, y: {gridCoord.y})
                      <br />
                    </div>
                    {/* renderItem(item, index) */}
                  </ReactiveGridItem>
                );
              })}
            </div>
          </>
        )}
      </Measure>
    </MousePositionContextProvider>
  );
};

// Because of our crazy typed functional component with generics in the props, we also need to use a modified React.memo to optimize this beast.
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087#issuecomment-542793243 for more on this.

const typedMemo: <T>(c: T) => T = React.memo;

export const ReactiveGrid = typedMemo(ReactiveGridElement);
