import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { AppState } from './rootReducer';

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;
