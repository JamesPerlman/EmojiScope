import React from 'react';
import 'tailwindcss/tailwind.css';
import { ModalActionCreator, useTypedDispatch } from '../../store';
import { useModalOptions } from '../../store/modal/selectors';
import { Modal } from '../../types';
import './EmojiDetailModal.css';

const EmojiDetailModalElement: React.FC = () => {
  const options = useModalOptions<Modal.EmojiDetailView>();
  const dispatch = useTypedDispatch();

  if (options === undefined) {
    return null;
  }

  const handlePress = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(ModalActionCreator.hide());
  };

  return (
    <div className="modal-wrapper" onClick={handlePress}>
      <div className="modal-content">{options.emoji.character}</div>
    </div>
  );
};

export const EmojiDetailModal = React.memo(EmojiDetailModalElement);
