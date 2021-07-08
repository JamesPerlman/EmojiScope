import { all, call, put, SagaReturnType, takeLatest } from 'redux-saga/effects';
import { api } from '../../api';
import { EmojiListActionCreator } from './actionCreators';
import { EmojiListActionTypes } from './actionTypes';

/*
  Worker Saga: Fired on BeginFetchRequest
*/
function* fetchEmojiListSaga() {
  try {
    const emojis: SagaReturnType<typeof api.emojis.listAll> = yield call(api.emojis.listAll);
    yield put(EmojiListActionCreator.fetchSuccess(emojis));
  } catch (error) {
    yield put(EmojiListActionCreator.fetchFailure(`${error}`));
  }
}

/*
  Starts worker saga on latest dispatched BeginFetchRequest action
*/
export function* emojiListSaga() {
  yield all([takeLatest(EmojiListActionTypes.BeginFetchRequest, fetchEmojiListSaga)]);
}
