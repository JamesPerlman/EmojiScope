import { Emoji } from '../../models';
import { EmojiListActionError } from './types';

// Action Types Enum
export enum EmojiListActionTypes {
  BeginFetchRequest = 'EmojiListBeginFetchRequest',
  FetchRequestDidSucceed = 'EmojiListFetchRequestDidSucceed',
  FetchRequestDidFail = 'EmojiListFetchRequestDidFail',
}

// Action Object Types
export type EmojiListRequestBegin = {
  type: EmojiListActionTypes.BeginFetchRequest;
};

export type EmojiListRequestSucceed = {
  type: EmojiListActionTypes.FetchRequestDidSucceed;
  payload: Emoji[];
};

export type EmojiListRequestFail = {
  type: EmojiListActionTypes.FetchRequestDidFail;
  payload: EmojiListActionError;
};

// Action types Union
export type EmojiListActions =
  | EmojiListRequestBegin
  | EmojiListRequestSucceed
  | EmojiListRequestFail;
