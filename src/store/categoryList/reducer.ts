import { CategoryListActions, CategoryListActionTypes } from './actionTypes';
import { CategoryListState } from './types';

const INITIAL_STATE: CategoryListState = {
  loading: false,
  error: undefined,
  items: [],
};

export const categoryListReducer = (
  state = INITIAL_STATE,
  action: CategoryListActions,
): CategoryListState => {
  switch (action.type) {
    case CategoryListActionTypes.FetchRequestDidBegin:
      return {
        ...state,
        loading: true,
      };
    case CategoryListActionTypes.FetchRequestDidSucceed:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: undefined,
      };
    case CategoryListActionTypes.FetchRequestDidFail:
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
