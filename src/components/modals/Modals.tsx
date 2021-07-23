import React from 'react';
import { useModalType } from '../../store/modal/selectors';
import { Modal } from '../../types';
import { EmojiDetailModal } from './EmojiDetailModal';

export const Modals: React.FC = () => {
  const modal = useModalType();
  switch (modal) {
    case Modal.EmojiDetailView:
      return <EmojiDetailModal />;
    case Modal.None:
      return null;
  }
};
