import { Emoji } from '../../models';
import {
  EmojiListActionTypes,
  EmojiListRequestBegin,
  EmojiListRequestFail,
  EmojiListRequestSucceed,
} from './actionTypes';
import { EmojiListActionError } from './types';

// Action Creators
export const EmojiListActionCreator = {
  fetchBegin: (): EmojiListRequestBegin => ({
    type: EmojiListActionTypes.BeginFetchRequest,
  }),
  fetchSuccess: (data: Emoji[]): EmojiListRequestSucceed => ({
    type: EmojiListActionTypes.FetchRequestDidSucceed,
    payload: data,
  }),
  fetchFailure: (error: EmojiListActionError): EmojiListRequestFail => ({
    type: EmojiListActionTypes.FetchRequestDidFail,
    payload: error,
  }),
};
