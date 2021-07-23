import { Modal } from './Modal';
import { EmojiDetailViewOptions, NoModalOptions } from './Options';

export type ModalTypeToOptionsType = {
  [Modal.EmojiDetailView]: EmojiDetailViewOptions;
  [Modal.None]: NoModalOptions;
};
