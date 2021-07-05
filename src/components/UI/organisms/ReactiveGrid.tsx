import React, { useMemo } from 'react';

import { ReactiveGridDescription } from '../../../types';
import { EmojiView } from '../atoms';
import { ReactiveGridItem } from './ReactiveGridItem';

import 'tailwindcss/tailwind.css';

interface ReactiveGridProps {
  itemRadius: number;
  itemSpacing: number;
  className?: string,
  style?: React.CSSProperties;
}

const numRows = 6;
const numCols = 6;

const emojis = new Array(numRows * numCols).fill('🤑');

// TODO: move this into ReactiveGridDescription (maybe?)
const get2DIndex = (index: number): { xIndex: number; yIndex: number } => {
  const yIndex = Math.floor(index / numRows);
  const xIndex = index - yIndex * numRows;

  return { xIndex, yIndex };
};

const ReactiveGridElement: React.FC<ReactiveGridProps> = (props) => {
  const { itemRadius, itemSpacing, style, className } = props;

  /* HOOKS */
  const grid = useMemo(
    () => new ReactiveGridDescription(itemRadius, itemSpacing, 1, 100),
    [itemRadius, itemSpacing],
  );

  /* DYNAMIC STYLES */

  /* RENDER */
  return (
    <div className="w-full h-full bg-red-600">
      {emojis.map((emoji, index) => {
        const { xIndex, yIndex } = get2DIndex(index);
        return (
          <ReactiveGridItem
            key={`item_${index}`}
            grid={grid}
            xIndex={xIndex}
            yIndex={yIndex}>
            <EmojiView key={`node_${index}`} char={emoji} />
          </ReactiveGridItem>
        );
      })}
    </div>
  );
};

export const ReactiveGrid = React.memo(ReactiveGridElement);
