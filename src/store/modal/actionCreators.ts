import { Modal, ModalTypeToOptionsType } from '../../types';
import { HideModalAction, ModalActionTypes, ShowModalAction } from './actionTypes';

export const ModalActionCreator = {
  show: <T extends Modal>(modal: T, options: ModalTypeToOptionsType[T]): ShowModalAction => ({
    type: ModalActionTypes.Show,
    payload: { modal, options: {
      modal,
      ...options,
    } },
  }),
  hide: (): HideModalAction => ({
    type: ModalActionTypes.Hide,
  }),
};
