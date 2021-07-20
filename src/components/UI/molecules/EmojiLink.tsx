import React from 'react';
import { Link } from 'react-router-dom';
import { Size2D } from '../../../libs';
import { Emoji } from '../../../models';
import { EmojiView } from '../atoms';

interface EmojiLinkProps {
  emoji: Emoji;
  itemSize: Size2D;
}

const EmojiLinkElement = (props: EmojiLinkProps) => {
  const { emoji, itemSize } = props;
  return (
    <Link
      to={{
        pathname: `/${emoji.character}`,
        state: { detail: true },
      }}>
      <EmojiView char={emoji.character} itemSize={itemSize} />
    </Link>
  );
};

export const EmojiLink = React.memo(EmojiLinkElement);
