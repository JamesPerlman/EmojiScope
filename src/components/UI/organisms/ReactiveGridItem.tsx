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

  const itemScale = useMemo(
    () => grid.getScale(itemPosition, mousePosition),
    [grid, itemPosition, mousePosition],
  );

  const reactiveStyle: React.CSSProperties = useMemo(() => {
    const { x, y } = itemDisplacement;
    const s = itemScale;
    return {
      transform: `translate(${x}px, ${y}px) scale(${s}, ${s})`,
    };
  }, [itemPosition, itemDisplacement, itemScale]);

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
