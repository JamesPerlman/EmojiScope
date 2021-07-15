import React, { useCallback, useMemo, useState } from 'react';
import Measure, { BoundingRect, ContentRect } from 'react-measure';

import { ReactiveGridItem } from './ReactiveGridItem';

import 'tailwindcss/tailwind.css';
import { createMagnificationEffect } from '../../../types/ItemStyleEffect';
import {
  createShiftedGrid,
  ShiftedGrid,
  Point2D,
  add2D,
  Index2D,
  XYNumeric,
  negate2D,
} from '../../../libs';
import { useDragDisplacement } from '../../../hooks';

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

const ReactiveGridElement: <T>(props: ReactiveGridProps<T>) => React.ReactElement = (props) => {
  // destructure props
  const { itemRadius, itemSpacing, magnification, effectRadius, items, renderItem } = props;

  /* HOOKS */
  const dragDisplacement = useDragDisplacement();

  // state vars
  const [gridCenter, setGridCenter] = useState<Point2D>({ x: 0, y: 0 });
  const [gridBounds, setGridBounds] = useState<BoundingRect>({
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
      setGridCenter({
        x: 0.5 * (bounds.left + bounds.right),
        y: 0.5 * (bounds.top + bounds.bottom),
      });
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
  const gridOffset: Point2D = useMemo(() => {
    return {
      x: (scrollOffset.x - Math.floor(scrollOffset.x / grid.unitSize.width) * grid.unitSize.width),
      y: (scrollOffset.y - Math.floor(scrollOffset.y / grid.unitSize.height) * grid.unitSize.height),
    };
  }, [grid, scrollOffset]);


  /* GRID LAYOUT VARS */
  const numberOfItemsPerAxis: XYNumeric = useMemo(
    () => ({
      x: Math.floor(gridBounds.width / grid.unitSize.width),
      y: Math.floor(gridBounds.height / grid.unitSize.height),
    }),
    [grid, gridBounds],
  );

  const gridCoordsInWindow: Index2D[] = useMemo(() => {
    //      const firstPointAtTopLeft = grid.screenPointToGridCoord({ x: gridBounds.left, y: gridBounds.top });
    const centerCoord = grid.screenPointToGridCoord(
      add2D(scrollOffset, getBoundingRectCenter(gridBounds)),
    );
    return [centerCoord];
  }, [grid, gridBounds, scrollOffset]);

  /* ItemStyleEffects */
  const effects = useMemo(() => {
    const magnify = createMagnificationEffect(effectRadius, magnification);
    return [magnify];
  }, [effectRadius, magnification]);

  /* DYNAMIC STYLES */
  /* RENDER */
  return (
    <Measure bounds onResize={handleResize}>
      {({ measureRef }) => (
        <>
          <div className="w-24 h-24 bg-blue-400">{`drag=${JSON.stringify(dragDisplacement)}`}</div>

          <div ref={measureRef} className="w-full h-full bg-gray-600">
            {gridCoordsInWindow.map((gridCoord: Index2D, index: number) => {
              return (
                <ReactiveGridItem
                  key={`item_${index}`}
                  grid={grid}
                  index={index}
                  effects={effects}
                  gridOffset={gridOffset}>
                  <div
                    style={{
                      backgroundColor: '#FFFF00',
                      width: `${grid.unitSize.width - 5}px`,
                      height: `${grid.unitSize.height - 5}px`,
                      fontSize: 11,
                    }}>
                    coord: ({index}: {JSON.stringify(gridCoord)}) itemIndex:{' '}
                    {grid.gridCoordToIndex(gridCoord)}
                  </div>
                  {/* renderItem(item, index) */}
                </ReactiveGridItem>
              );
            })}
          </div>
          <div
            className="w-4 h-4 bg-black"
            style={{
              position: 'absolute',
              left: gridCenter.x + scrollOffset.x,
              top: gridCenter.y + scrollOffset.y,
            }}></div>
        </>
      )}
    </Measure>
  );
};

// Because of our crazy typed functional component with generics in the props, we also need to use a modified React.memo to optimize this beast.
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087#issuecomment-542793243 for more on this.

const typedMemo: <T>(c: T) => T = React.memo;

export const ReactiveGrid = typedMemo(ReactiveGridElement);
