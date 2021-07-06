import React, { useCallback, useMemo, useState } from 'react';
import Measure, { ContentRect } from 'react-measure';

import { Point2D, ReactiveGridDescription } from '../../../types';
import { EmojiView } from '../atoms';
import { ReactiveGridItem } from './ReactiveGridItem';

import 'tailwindcss/tailwind.css';

interface ReactiveGridProps {
  itemRadius: number;
  itemSpacing: number;
  magnification: number;
  effectRadius: number;
}

const numRows = 6;
const numCols = 6;


// TODO: move this into ReactiveGridDescription (maybe?)
const get2DIndex = (index: number): { xIndex: number; yIndex: number } => {
  const yIndex = Math.floor(index / numRows);
  const xIndex = index - yIndex * numRows;

  return {
    xIndex: xIndex - Math.floor(numRows / 2),
    yIndex: yIndex - Math.floor(numCols / 2),
  };
};


const emojis = new Array(numRows * numCols).fill('🤑').map((_, index) => {
  const { xIndex, yIndex } = get2DIndex(index);
  return `(${xIndex}, ${yIndex})`;
});

const ReactiveGridElement: React.FC<ReactiveGridProps> = (props) => {
  // destructure props
  const { itemRadius, itemSpacing, magnification, effectRadius } = props;

  /* HOOKS */

  // state vars
  const [gridCenter, setGridCenter] = useState<Point2D>({ x: 0, y: 0 });

  // when item spacing or item radius changes, we need to recreate the grid math functions
  const grid = useMemo(
    () =>
      new ReactiveGridDescription(gridCenter, itemRadius, itemSpacing, magnification, effectRadius),
    [gridCenter, itemRadius, itemSpacing],
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

  /* DYNAMIC STYLES */

  /* RENDER */
  return (
    <Measure bounds onResize={handleResize}>
      {({ measureRef }) => (
        <div ref={measureRef} className="w-full h-full bg-red-600">
          {emojis.map((emoji, index) => {
            const { xIndex, yIndex } = get2DIndex(index);
            return (
              <ReactiveGridItem key={`item_${index}`} grid={grid} xIndex={xIndex} yIndex={yIndex}>
                <EmojiView key={`node_${index}`} char={emoji} />
              </ReactiveGridItem>
            );
          })}
        </div>
      )}
    </Measure>
  );
};

export const ReactiveGrid = React.memo(ReactiveGridElement);
