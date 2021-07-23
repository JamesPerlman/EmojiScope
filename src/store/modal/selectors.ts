import { Modal, ModalTypeToOptionsType } from '../../types';
import { useTypedSelector } from '../useTypedSelector';

export function useModalOptions<T extends Modal, K = ModalTypeToOptionsType[T]>(): K | undefined {
  const modalState = useTypedSelector((state) => state.modal);
  return modalState.options as K;
}

export function useModalType(): Modal {
  return useTypedSelector((state) => state.modal.modal);
}
