import { EmojiListActions, EmojiListActionTypes } from './actionTypes';
import { EmojiListState } from './types';

const INITIAL_STATE: EmojiListState = {
  loading: false,
  error: undefined,
  items: [],
};

export const emojiListReducer = (
  state = INITIAL_STATE,
  action: EmojiListActions,
): EmojiListState => {
  switch (action.type) {
    case EmojiListActionTypes.BeginFetchRequest:
      return {
        ...state,
        loading: true,
      };
    case EmojiListActionTypes.FetchRequestDidSucceed:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: undefined,
      };
    case EmojiListActionTypes.FetchRequestDidFail:
      return {
        ...state,
        loading: false,
        items: [],
        error: action.payload,
      };
    default:
      return state;
  }
};
