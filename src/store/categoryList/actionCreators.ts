import { Category } from '../../models';
import {
  CategoryListActionTypes,
  CategoryListRequestBegin,
  CategoryListRequestFail,
  CategoryListRequestSucceed,
} from './actionTypes';
import { CategoryListActionError } from './types';

// Action Creators
export const CategoryListActionCreator = {
  fetchBegin: (): CategoryListRequestBegin => ({
    type: CategoryListActionTypes.BeginFetchRequest,
  }),
  fetchSuccess: (data: Category[]): CategoryListRequestSucceed => ({
    type: CategoryListActionTypes.FetchRequestDidSucceed,
    payload: data,
  }),
  fetchFailure: (error: CategoryListActionError): CategoryListRequestFail => ({
    type: CategoryListActionTypes.FetchRequestDidFail,
    payload: error,
  }),
};
