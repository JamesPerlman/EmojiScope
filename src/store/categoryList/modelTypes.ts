import { Category } from '../../models';

export type CategoryListActionError = string;

// State Type
export type CategoryListState = {
  loading: boolean;
  error: CategoryListActionError | undefined;
  items: Category[];
};
