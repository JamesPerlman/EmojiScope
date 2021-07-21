import { Emoji } from '../../models';

export type EmojiListActionError = string;

// State Type
export type EmojiListState = {
  loading: boolean;
  error: EmojiListActionError | undefined;
  items: Emoji[];
};
