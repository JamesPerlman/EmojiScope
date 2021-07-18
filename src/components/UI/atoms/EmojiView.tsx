import React from 'react';
import 'tailwindcss/tailwind.css';
import { Size2D } from '../../../libs';

interface EmojiViewProps {
  char: string;
  style?: React.CSSProperties;
  itemSize: Size2D;
}

const EmojiViewElement: React.FC<EmojiViewProps> = (props) => {
  const { char, itemSize, style } = props;
  return (
    <div
      style={{
        width: `${itemSize.width - 5}px`,
        height: `${itemSize.height - 5}px`,
        fontSize: Math.min(itemSize.width, itemSize.height) - 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {char}
    </div>
  );
};

export const EmojiView = React.memo(EmojiViewElement);
