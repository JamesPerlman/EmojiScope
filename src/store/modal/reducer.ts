import { Modal, NoModalOptions } from '../../types';
import { ModalActions, ModalActionTypes } from './actionTypes';
import { ModalState } from './stateTypes';

const INITIAL_STATE: ModalState = {
  modal: Modal.None,
  options: {} as NoModalOptions,
};

export const modalReducer = (state = INITIAL_STATE, action: ModalActions): ModalState => {
  switch (action.type) {
    case ModalActionTypes.Hide:
      return INITIAL_STATE;
    case ModalActionTypes.Show:
      return {
        modal: action.payload.modal,
        options: action.payload.options,
      };
    default:
      return state;
  }
};
