import React, { useCallback, useMemo, useState } from 'react';
import Measure, { ContentRect } from 'react-measure';

import { ReactiveGridItem } from './ReactiveGridItem';

import 'tailwindcss/tailwind.css';
import { createMagnificationEffect } from '../../../types/ItemStyleEffect';
import {
  createShiftedGrid,
  ShiftedGrid,
  Point2D,
  cartToGrid,
  gridToCart,
  add2D,
} from '../../../libs';
import { getGridQuadrant } from '../../../libs/ShiftedGrid/utils/QuadrantUtil';
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
const ReactiveGridElement: <T>(props: ReactiveGridProps<T>) => React.ReactElement = (props) => {
  // destructure props
  const { itemRadius, itemSpacing, magnification, effectRadius, items, renderItem } = props;

  /* HOOKS */
  const dragDisplacement = useDragDisplacement();

  // state vars
  const [gridCenter, setGridCenter] = useState<Point2D>({ x: 0, y: 0 });

  // callbacks

  // when the grid changes size we need to update its center
  const handleResize = useCallback((info: ContentRect) => {
    const { bounds } = info;
    if (bounds !== undefined) {
      setGridCenter({
        x: 0.5 * (bounds.left + bounds.right),
        y: 0.5 * (bounds.top + bounds.bottom),
      });
    }
  }, []);

  // calculate scrollOffset
  const scrollOffset: Point2D = useMemo(() => dragDisplacement, [dragDisplacement]);

  // when item spacing or item radius changes, we need to recreate the grid math functions
  const grid: ShiftedGrid = useMemo(
    () => createShiftedGrid(itemRadius, itemSpacing, add2D(gridCenter, scrollOffset)),
    [itemRadius, itemSpacing, gridCenter, scrollOffset],
  );

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
          <div className="w-24 h-24 bg-blue-400">
            {`drag=${JSON.stringify(dragDisplacement)}`}
          </div>
          <div ref={measureRef} className="w-full h-full bg-gray-600">
            {items.map((item, index) => {
              const { x: gx, y: gy } = grid.indexToGridCoord(index);
              const q = getGridQuadrant({ x: gx, y: gy });
              const c = gridToCart({ x: gx, y: gy });
              const g = cartToGrid(c);
              const color = quadrantBGs[q];
              return (
                <ReactiveGridItem key={`item_${index}`} grid={grid} index={index} effects={effects}>
                  <div
                    style={{
                      backgroundColor: color,
                      width: `${grid.unitSize.width - 5}px`,
                      height: `${grid.unitSize.height - 5}px`,
                      fontSize: 11,
                    }}>
                    {index}: ({gx}, {gy})<br />
                    {grid.gridCoordToIndex({ x: gx, y: gy }, index)}
                    <br />
                    {JSON.stringify(c)}
                    <br />
                    {JSON.stringify(g)}
                  </div>
                  {/*<renderItem(item, index)*/}
                </ReactiveGridItem>
              );
            })}
          </div>
        </>
      )}
    </Measure>
  );
};

// Because of our crazy typed functional component with generics in the props, we also need to use a modified React.memo to optimize this beast.
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087#issuecomment-542793243 for more on this.

const typedMemo: <T>(c: T) => T = React.memo;

export const ReactiveGrid = typedMemo(ReactiveGridElement);
