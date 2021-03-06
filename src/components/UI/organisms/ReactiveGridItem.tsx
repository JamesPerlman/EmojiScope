import React, { useMemo } from 'react';
import { ReactiveGridItemContextProvider, useMousePositionContext } from '../../../contexts';
import { add2D, GridUtil, Point2D, ShiftedGrid } from '../../../libs';
import { ItemStyleEffect } from '../../../types';

type ReactiveGridItemProps = React.PropsWithChildren<{
  grid: ShiftedGrid;
  index: number;
  effects?: ItemStyleEffect[];
  gridCenter: Point2D;
  gridOffset: Point2D;
}>;

const ReactiveGridItemElement: React.FC<ReactiveGridItemProps> = (props) => {
  const { children, grid, index, effects, gridCenter, gridOffset } = props;

  // TODO: a way of turning on & off effects
  // Grabbing mousePosition from a context is SO MUCH FASTER than using useMousePosition here!
  const mousePosition = useMousePositionContext().mousePosition;

  const itemPosition = useMemo(
    () => add2D(gridOffset, grid.gridCoordToScreenPoint(GridUtil.indexToCoord(index))),
    [grid, index, gridOffset],
  );

  /* Calculate reactive styles by calling each effect's `getStyle` function
   * KNOWN ISSUE: If multiple effects output a style containing a `transform` object, the styles will not be combined correctly.
   * AKA: The latest effect.getStyle()'s `transform` will overwrite the previous one.
   * Currently this isn't an issue since only one of our effects is using the transform property.
   */
  const reactiveStyles: React.CSSProperties = useMemo(() => {
    // combine all styles from all effects
    return (effects ?? []).reduce((prevStyle: React.CSSProperties, curEffect: ItemStyleEffect) => {
      return {
        ...prevStyle,
        ...curEffect.getStyle({ itemPosition, mousePosition, centerPosition: gridCenter }),
      };
    }, {} as React.CSSProperties);
  }, [effects, itemPosition, mousePosition, gridCenter]);

  const itemStyle: React.CSSProperties = {
    position: 'absolute',
    overflow: 'visible',
    width: grid.unitSize.width,
    height: grid.unitSize.height,
    ...reactiveStyles,
  };

  return (
    <div style={itemStyle}>
      <ReactiveGridItemContextProvider itemStyle={itemStyle}>
        {children}
      </ReactiveGridItemContextProvider>
    </div>
  );
};

export const ReactiveGridItem = React.memo(ReactiveGridItemElement);
