import React from 'react';
import { Emoji } from '../../../models';

export type EmojiDetailViewOptions = {
  emoji: Emoji;
  reactiveItemStyles: React.CSSProperties; // The styles of the item that the user clicked on
};
