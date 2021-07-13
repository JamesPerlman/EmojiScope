import React, { useCallback, useMemo, useState } from 'react';
import Measure, { ContentRect } from 'react-measure';

import { ReactiveGridItem } from './ReactiveGridItem';

import 'tailwindcss/tailwind.css';
import { createMagnificationEffect } from '../../../types/ItemStyleEffect';
import { createShiftedGrid, ShiftedGrid, Point2D, cartToGrid } from '../../../libs';

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
const ReactiveGridElement: <T>(props: ReactiveGridProps<T>) => React.ReactElement = (props) => {
  // destructure props
  const { itemRadius, itemSpacing, magnification, effectRadius, items, renderItem } = props;

  /* HOOKS */

  // state vars
  const [gridCenter, setGridCenter] = useState<Point2D>({ x: 0, y: 0 });

  // when item spacing or item radius changes, we need to recreate the grid math functions
  const grid: ShiftedGrid = useMemo(
    () => createShiftedGrid(itemRadius, itemSpacing, gridCenter),
    [itemRadius, itemSpacing, gridCenter],
  );

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
        <div ref={measureRef} className="w-full h-full bg-red-600">
          {items.map((item, index) => {
            const { x: gx, y: gy } = grid.indexToGridCoord(index);
            const { x, y } = grid.gridCoordToScreenPoint({ x: gx, y: gy });
            return (
              <ReactiveGridItem key={`item_${index}`} grid={grid} index={index} effects={effects}>
                <div style={{ backgroundColor: 'white', width: 60, height: 20, fontSize: 11 }}>
                  {index}: ({gx}, {gy})
                </div>
                {/*<renderItem(item, index)*/}
              </ReactiveGridItem>
            );
          })}
        </div>
      )}
    </Measure>
  );
};

// Because of our crazy typed functional component with generics in the props, we also need to use a modified React.memo to optimize this beast.
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087#issuecomment-542793243 for more on this.

const typedMemo: <T>(c: T) => T = React.memo;

export const ReactiveGrid = typedMemo(ReactiveGridElement);
