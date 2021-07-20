import React, { useMemo } from 'react';
import 'tailwindcss/tailwind.css';
import { Size2D } from '../../../libs';
import './EmojiView.css';
interface EmojiViewProps {
  char: string;
  style?: React.CSSProperties;
  itemSize: Size2D;
}

const EmojiViewElement: React.FC<EmojiViewProps> = (props) => {
  const { char, itemSize, style } = props;

  const dynamicStyle = useMemo(
    () => ({
      width: `${itemSize.width - 5}px`,
      height: `${itemSize.height - 5}px`,
      fontSize: Math.min(itemSize.width, itemSize.height) - 10,
    }),
    [itemSize],
  );

  return (
    <div className="emoji-view-container" style={{ ...dynamicStyle, ...(style ?? {}) }}>
      {char}
    </div>
  );
};

export const EmojiView = React.memo(EmojiViewElement);
