import { useDispatch } from 'react-redux';
import { Actions } from './rootReducer';

export type Dispatch = <T>(action: Actions) => T;
export const useTypedDispatch = () => useDispatch<Dispatch>();
