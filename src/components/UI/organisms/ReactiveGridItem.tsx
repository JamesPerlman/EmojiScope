import React, { useMemo } from 'react';
import { useMousePosition } from '../../../hooks';
import { ShiftedGrid } from '../../../libs';
import { ItemStyleEffect } from '../../../types';

type ReactiveGridItemProps = React.PropsWithChildren<{
  grid: ShiftedGrid;
  index: number;
  effects?: ItemStyleEffect[];
}>;

const ReactiveGridItemElement: React.FC<ReactiveGridItemProps> = (props) => {
  const { children, grid, index, effects } = props;

  // TODO: a way of turning on & off effects
  // previous method was to turn them off if useMousePosition() returned undefined
  const mousePosition = useMousePosition() ?? { x: 0, y: 0 };

  const itemPosition = useMemo(() => grid.gridCoordToScreenPoint(grid.indexToGridCoord(index)), [grid, index]);

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
        ...curEffect.getStyle(itemPosition, mousePosition),
      };
    }, {} as React.CSSProperties);
  }, [effects, itemPosition, mousePosition]);

  return (
    <div
      style={{
        position: 'absolute',
        width: grid.spaceSize,
        height: grid.spaceSize,
        ...reactiveStyles,
      }}>
      {children}
    </div>
  );
};

export const ReactiveGridItem = React.memo(ReactiveGridItemElement);
