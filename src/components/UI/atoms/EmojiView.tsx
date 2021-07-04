import React from 'react';
import 'tailwindcss/tailwind.css';

interface EmojiViewProps {
  char: string;
  style?: React.CSSProperties;
}

const EmojiViewElement: React.FC<EmojiViewProps> = (props) => {
  const { char, style } = props;
  return (
    <div className="bg-white rounded-full">
      x
    </div>
  );
};

export const EmojiView = React.memo(EmojiViewElement);
