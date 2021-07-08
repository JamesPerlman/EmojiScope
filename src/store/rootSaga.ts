import { all, fork } from 'redux-saga/effects';
import { emojiListSaga } from './emojiList/sagas';

export function* rootSaga() {
  yield all([fork(emojiListSaga)]);
}
