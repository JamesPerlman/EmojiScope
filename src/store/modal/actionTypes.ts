import { Modal, ModalOptions } from '../../types';

export enum ModalActionTypes {
  Show,
  Hide,
}

export type ShowModalActionPayload = {
  modal: Modal;
  options: ModalOptions;
};

export type ShowModalAction = {
  type: ModalActionTypes.Show;
  payload: ShowModalActionPayload;
};

export type HideModalAction = {
  type: ModalActionTypes.Hide;
};

export type ModalActions = ShowModalAction | HideModalAction;
