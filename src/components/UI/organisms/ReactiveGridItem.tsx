import React, { useMemo } from 'react';
import { Index2D, OffsetGrid } from '../../../types';
import { useMousePosition } from '../../../hooks';

type ReactiveGridItemProps = React.PropsWithChildren<{
  grid: OffsetGrid;
  index: number;
}>;

const ReactiveGridItemElement: React.FC<ReactiveGridItemProps> = (props) => {
  const { children, grid, index } = props;

  //const mousePosition = useMousePosition();

  const itemPosition = useMemo(() => grid.getPositionFromGridIndex(index), [grid, index]);

/*  const itemDisplacement = useMemo(
    () => grid.getDisplacement(itemPosition, mousePosition),
    [grid, itemPosition, mousePosition],
  );
*/
/*
  const itemScale = useMemo(
    () => grid.getScale(itemPosition, mousePosition),
    [grid, itemPosition, mousePosition],
  );
  */

  const reactiveStyle: React.CSSProperties = useMemo(() => {
    const { x, y } = itemPosition;
    const s = { x: 1, y: 1 };
    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  }, [itemPosition]);

  return (
    <div
      style={{
        position: 'absolute',
        width: 2.0 * grid.itemRadius,
        height: 2.0 * grid.itemRadius,
        ...reactiveStyle,
      }}>
      {children}
    </div>
  );
};

export const ReactiveGridItem = React.memo(ReactiveGridItemElement);
