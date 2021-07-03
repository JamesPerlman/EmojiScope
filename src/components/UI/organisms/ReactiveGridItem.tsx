import React, { useMemo } from 'react';
import { Point2D, ReactiveGridDescription } from '../../../types';
import { useMousePosition } from '../../../hooks';

type ReactiveGridItemProps = React.PropsWithChildren<{
  grid: ReactiveGridDescription;
  xIndex: number;
  yIndex: number;
}>;

const ReactiveGridItemElement: React.FC<ReactiveGridItemProps> = (props) => {
  const { children, grid, xIndex, yIndex } = props;

  const positionStyle: React.CSSProperties = useMemo(() => {
    const { x, y } = grid.getItemPosition(xIndex, yIndex);
    return {
      left: x,
      top: y,
    };
  }, [grid, xIndex, yIndex]);

  return (
    <div
      style={{ position: 'absolute', ...positionStyle }}
    >
      {children}
    </div>
  );
};

export const ReactiveGridItem = React.memo(ReactiveGridItemElement);
