import React, { useMemo } from 'react';
import { add, Index2D, Point2D, ReactiveGridDescription } from '../../../types';
import { useMousePosition } from '../../../hooks';

type ReactiveGridItemProps = React.PropsWithChildren<{
  grid: ReactiveGridDescription;
  xIndex: number;
  yIndex: number;
}>;

const ReactiveGridItemElement: React.FC<ReactiveGridItemProps> = (props) => {
  const { children, grid, xIndex, yIndex } = props;

  const mousePosition = useMousePosition();

  const indices: Index2D = useMemo(() => ({ x: xIndex, y: yIndex }), [xIndex, yIndex]);

  const itemPosition = useMemo(() => grid.getItemPosition(indices), [grid, indices]);

  const itemDisplacement = useMemo(
    () => grid.getDisplacement(itemPosition, mousePosition),
    [grid, itemPosition, mousePosition],
  );

  const positionStyle: React.CSSProperties = useMemo(() => {
    const { x, y } = add(itemPosition, itemDisplacement);
    return {
      left: x,
      top: y,
    };
  }, [itemPosition, itemDisplacement]);

  return <div style={{ position: 'absolute', ...positionStyle }}>{children}</div>;
};

export const ReactiveGridItem = React.memo(ReactiveGridItemElement);
