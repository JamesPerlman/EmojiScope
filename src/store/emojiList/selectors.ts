import { AppState } from '../rootReducer';
import { useTypedSelector } from '../useTypedSelector';

const selectEmojis = (state: AppState) => state.emojis.items;

export const useSelectEmojis = () => useTypedSelector(selectEmojis);
