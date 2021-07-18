import { combineReducers } from 'redux';
import { categoryListReducer } from './categoryList/reducer';
import { emojiListReducer } from './emojiList/reducer';

export const rootReducer = combineReducers({
  categories: categoryListReducer,
  emojis: emojiListReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
