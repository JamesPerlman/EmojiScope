import React, { useCallback, useMemo, useState } from 'react';
import Measure, { BoundingRect, ContentRect } from 'react-measure';
import 'tailwindcss/tailwind.css';
import { MousePositionContextProvider } from '../../../contexts';
import { useDragDisplacement } from '../../../hooks';
import {
  add2D,
  CartesianUtil,
  GridUtil,
  Index2D,
  normalize2D,
  Point2D,
  ShiftedGrid,
  Size2D,
  subtract2D,
} from '../../../libs';
import {
  createEdgeFadeEffect,
  createMagnificationEffect,
  ItemStyleEffect,
} from '../../../types/ItemStyleEffect';
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
  const dragDisplacement = useDragDisplacement({
    useMomentum: true,
    damping: 0.95,
  });

  // state vars
  const [gridCenter, setGridCenter] = useState<Point2D>({ x: 0, y: 0 });
  const [windowedBounds, setGridBounds] = useState<BoundingRect>(
    BoundingRectUtil.emptyBoundingRect,
  );

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
  const grid: ShiftedGrid = useMemo(() => {
    // We need to adjust the position of the gridCenter since our container doesn't start at the top-left of the page
    const containerTopLeft: Point2D = {
      x: windowedBounds.left,
      y: windowedBounds.top,
    };

    const halfItemSizeOffset: Point2D = {
      x: 0.5 * (itemRadius + itemSpacing),
      y: 0.5 * (itemRadius + itemSpacing),
    };

    const offsetCenter = add2D(halfItemSizeOffset, subtract2D(gridCenter, containerTopLeft));
    return GridUtil.createShiftedGrid(itemRadius, itemSpacing, offsetCenter);
  }, [itemRadius, itemSpacing, gridCenter, windowedBounds]);

  // calculate scrollOffset
  const scrollOffset: Point2D = useMemo(() => {
    return dragDisplacement;
  }, [dragDisplacement, gridCenter]);

  // scaledScrollOffset is in grid coordinate space
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
        const gridCoord = CartesianUtil.cartToGrid(cartPoint);

        // Add it to our gridCoords array
        gridCoords.push(gridCoord);
      }
    }
    return gridCoords;
  }, [grid, windowedBounds, scrollOffset]);

  // Transform mouse position
  const adjustMousePosition = useCallback(
    (inputMousePosition: Point2D): Point2D => {
      const windowedTopLeftPosition: Point2D = {
        x: windowedBounds.left,
        y: windowedBounds.top,
      };
      return subtract2D(inputMousePosition, windowedTopLeftPosition);
    },
    [windowedBounds],
  );

  /* ItemStyleEffects */
  const effects = useMemo(() => {
    // create magnify effect
    const magnifyEffect = createMagnificationEffect(effectRadius, magnification);

    // create edgeFade effect
    const fadeDropOffDistance = Math.SQRT1_2 * Math.min(grid.unitSize.width, grid.unitSize.height);
    const edgeFadeEffect: ItemStyleEffect = createEdgeFadeEffect(
      windowedBounds.width * 0.4,
      fadeDropOffDistance,
    );

    return [edgeFadeEffect, magnifyEffect];
  }, [effectRadius, magnification, windowedBounds.width, grid.unitSize]);

  /* RENDER */
  return (
    <MousePositionContextProvider transformMousePosition={adjustMousePosition}>
      <Measure bounds onResize={handleResize}>
        {({ measureRef }) => (
          <>
            <div ref={measureRef} className="w-full h-full bg-gray-600">
              {gridCoordsInWindowedScrollArea.map((gridCoord: Index2D) => {
                const index = GridUtil.coordToIndex(gridCoord);
                const item = items[index];

                if (item === undefined) {
                  return null;
                }

                return (
                  <ReactiveGridItem
                    key={`item_${index}`}
                    grid={grid}
                    index={index}
                    effects={effects}
                    gridCenter={{
                      x: 0.5 * windowedBounds.width,
                      y: 0.5 * windowedBounds.height,
                    }}
                    gridOffset={scrollOffset}>
                    {renderItem(item, index, {
                      width: grid.itemRadius * 2.0,
                      height: grid.itemRadius * 2.0,
                    })}
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
