import { combineReducers } from 'redux';
import { categoryListReducer } from './categoryList/reducer';
import { emojiListReducer } from './emojiList/reducer';
import { modalReducer } from './modal/reducer';

export const rootReducer = combineReducers({
  categories: categoryListReducer,
  emojis: emojiListReducer,
  modal: modalReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type Actions = Parameters<typeof rootReducer>[1];
