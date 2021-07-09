import React from 'react';
import { EmojiView, ReactiveGrid } from '../UI';

import 'tailwindcss/tailwind.css';
import { useSelectEmojis } from '../../store/emojiList/selectors';
import { Emoji } from '../../models';

type EmojiBrowserPageProps = {};

const EmojiBrowserPageElement: React.FC<EmojiBrowserPageProps> = (props) => {
  const emojis = useSelectEmojis().slice(0, 19);
  return (
    <div className="w-full h-full p-4">
      <ReactiveGrid
        magnification={0}
        effectRadius={200}
        itemRadius={20}
        itemSpacing={20}
        items={emojis}
        renderItem={(item, number) => (
          <EmojiView char={item.character} />
        )}
      />
    </div>
  );
};

export const EmojiBrowserPage = React.memo(EmojiBrowserPageElement);
