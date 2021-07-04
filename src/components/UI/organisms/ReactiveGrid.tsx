import React, { useMemo } from 'react';
import { ReactiveGridDescription } from '../../../types';
import { EmojiView } from '../atoms';
import { ReactiveGridItem } from './ReactiveGridItem';

interface ReactiveGridProps {
  itemRadius: number;
  itemSpacing: number;
}

const numRows = 10;
const numCols = 10;

const spacingX = 10;
const spacingY = 10;

const emojis = new Array(numRows * numCols).fill('🤑');

const styleForItemAtIndex = (index: number): React.CSSProperties => {
  const row = Math.floor(index / numRows);
  const col = index - row * numRows;
  return {
    position: 'absolute',
    left: spacingX * col,
    top: spacingY * row,
  };
};

// TODO: move this into ReactiveGridDescription (maybe?)
const get2DIndex = (index: number): { xIndex: number; yIndex: number } => {
  const yIndex = Math.floor(index / numRows);
  const xIndex = index - yIndex * numRows;

  return { xIndex, yIndex };
};

const ReactiveGridElement: React.FC<ReactiveGridProps> = (props) => {
  const { itemRadius, itemSpacing } = props;

  const grid = useMemo(
    () => new ReactiveGridDescription(itemRadius, itemSpacing, 2, 10),
    [itemRadius, itemSpacing],
  );

  return (
    <div style={{ width: '100pt', height: '100pt', overflow: 'visible' }}>
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
