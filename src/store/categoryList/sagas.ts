import { all, call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import { api } from '../../api';
import { CategoryListActionCreator } from './actionCreators';
import { CategoryListActionTypes } from './actionTypes';

/*
  Worker Saga: Fired on BeginFetchRequest
*/
function* fetchCategoryListSaga() {
  try {
    const categories: SagaReturnType<typeof api.categories.listAll> = yield call(
      api.categories.listAll,
    );
    yield put(CategoryListActionCreator.fetchSuccess(categories));
  } catch (error) {
    yield put(CategoryListActionCreator.fetchFailure(`${error}`));
  }
}

/*
  Starts worker saga on latest dispatched BeginFetchRequest action
*/
export function* emojiListSaga() {
  yield all([takeLatest(CategoryListActionTypes.BeginFetchRequest, fetchCategoryListSaga)]);
}
