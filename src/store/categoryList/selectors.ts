import { AppState } from '../rootReducer';
import { useTypedSelector } from '../useTypedSelector';

const selectCategories = (state: AppState) => state.categories.items;

export const useSelectCategories = () => useTypedSelector(selectCategories);
