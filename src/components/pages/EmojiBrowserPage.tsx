import React from 'react';
import { EmojiView, ReactiveGrid } from '../UI';

import 'tailwindcss/tailwind.css';
import { useSelectEmojis } from '../../store/emojiList/selectors';

type EmojiBrowserPageProps = {};

const EmojiBrowserPageElement: React.FC<EmojiBrowserPageProps> = (props) => {
  const emojis = useSelectEmojis();
  return (
    <div className="w-full h-full p-4">
      <ReactiveGrid
        magnification={1.0}
        effectRadius={200}
        itemRadius={40}
        itemSpacing={20}
        items={emojis}
        renderItem={(item, index, itemSize) => (
          <EmojiView char={item?.character} itemSize={itemSize} />
        )}
      />
    </div>
  );
};

export const EmojiBrowserPage = React.memo(EmojiBrowserPageElement);
