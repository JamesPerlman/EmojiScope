import React, { useCallback, useMemo, useState } from 'react';
import Measure, { BoundingRect, ContentRect } from 'react-measure';
import 'tailwindcss/tailwind.css';
import { MousePositionContextProvider } from '../../../contexts';
import { useDragDisplacement } from '../../../hooks';
import {
  cartToGrid,
  GridUtil,
  Index2D,
  normalize2D,
  Point2D,
  ShiftedGrid,
  Size2D,
} from '../../../libs';
import { createMagnificationEffect } from '../../../types/ItemStyleEffect';
import { BoundingRectUtil } from '../../../utils';
import { ReactiveGridItem } from './ReactiveGridItem';

interface ReactiveGridProps<T> {
  itemRadius: number;
  itemSpacing: number;
  magnification: number;
  effectRadius: number;
  items: T[];
  renderItem: (item: T, index: number, size: Size2D) => React.ReactElement | string | null;
}

/*
 I would love to make ReactiveGridElement a React.FC, however since there are generic types associated with ReactiveGridProps we cannot do this.
 There are some good resources here for why this needs to be done this way https://wanago.io/2020/03/09/functional-react-components-with-generic-props-in-typescript/
 It's just a limitation of typescript.  Here's another good resource: https://stackoverflow.com/questions/53958028/how-to-use-generics-in-props-in-react-in-a-functional-component

 Because of the way we will use ReactiveGrid in this project, this method will work, albeit a bit more confusing and verbose should we need to match the exact functionality of React.FC in the future
 */

const ReactiveGridElement: <T>(props: ReactiveGridProps<T>) => React.ReactElement = (props) => {
  // destructure props
  const { itemRadius, itemSpacing, magnification, effectRadius, items, renderItem } = props;

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
      setGridCenter(BoundingRectUtil.getCenter(bounds));
      setGridBounds(bounds);
    }
  }, []);

  // when item spacing or item radius changes, we need to recreate the grid math functions
  const grid: ShiftedGrid = useMemo(
    () => GridUtil.createShiftedGrid(itemRadius, itemSpacing, gridCenter),
    [itemRadius, itemSpacing, gridCenter],
  );

  // calculate scrollOffset
  const scrollOffset: Point2D = useMemo(() => dragDisplacement, [dragDisplacement]);
  const scaledScrollOffset = useMemo(
    () => normalize2D(scrollOffset, grid.unitSize),
    [grid.unitSize, scrollOffset],
  );

  // Calculate array of items in windowed scroll area
  const gridCoordsInWindowedScrollArea: Index2D[] = useMemo(() => {
    // Define some useful constants
    const scaledWindowedBounds = BoundingRectUtil.getNormalized(windowedBounds, grid.unitSize);
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
                const index = GridUtil.coordToIndex(gridCoord);
                const item = items[index];

                return (
                  <ReactiveGridItem
                    key={`item_${index}`}
                    grid={grid}
                    index={index}
                    effects={effects}
                    gridOffset={scrollOffset}>
                    {renderItem(item, index, { width: grid.itemRadius * 2.0, height: grid.itemRadius * 2.0 })}
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
