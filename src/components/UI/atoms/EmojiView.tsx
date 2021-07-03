import React from 'react';
import 'tailwindcss/tailwind.css';

interface EmojiViewProps {
  char: string;
  style?: React.CSSProperties;
}

const EmojiViewElement: React.FC<EmojiViewProps> = (props) => {
  const { char, style } = props;
  return (
    <div className="rounded w-5 h-5 bg-white" style={style}>
      {char}
    </div>
  );
};

export const EmojiView = React.memo(EmojiViewElement);
