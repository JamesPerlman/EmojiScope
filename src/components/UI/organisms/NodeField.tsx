import React from 'react';
import { Node } from '../atoms';

interface NodeFieldProps {
  n?: string;
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

const NodeFieldElement: React.FC<NodeFieldProps> = (props) => {
  const { n } = props;
  return (
    <div style={{ width: '100pt', height: '100pt', overflow: 'visible' }}>
      {emojis.map((emoji, index) => (
        <Node key={`node_${index}`} content={emoji} style={styleForItemAtIndex(index)} />
      ))}
    </div>
  );
};

export const NodeField = React.memo(NodeFieldElement);
