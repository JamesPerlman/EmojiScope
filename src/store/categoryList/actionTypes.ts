import { Category } from '../../models';
import { CategoryListActionError } from './stateTypes';

// Action Types Enum
export enum CategoryListActionTypes {
  BeginFetchRequest = 'CategoryListBeginFetchRequest',
  FetchRequestDidSucceed = 'CategoryListFetchRequestDidSucceed',
  FetchRequestDidFail = 'CategoryListFetchRequestDidFail',
}

// Action Object Types
export type CategoryListRequestBegin = {
  type: CategoryListActionTypes.BeginFetchRequest;
};

export type CategoryListRequestSucceed = {
  type: CategoryListActionTypes.FetchRequestDidSucceed;
  payload: Category[];
};

export type CategoryListRequestFail = {
  type: CategoryListActionTypes.FetchRequestDidFail;
  payload: CategoryListActionError;
};

// Action Types Union
export type CategoryListActions =
  | CategoryListRequestBegin
  | CategoryListRequestSucceed
  | CategoryListRequestFail;
