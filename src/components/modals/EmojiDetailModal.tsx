import 'tailwindcss/tailwind.css';
import './EmojiDetailModal.css';
import React from 'react';

const EmojiDetailModalElement = () => {
  return (
    <div className="modal-wrapper">
      <div className="modal-content">
        Stuff
      </div>
    </div>
  );
};

export const EmojiDetailModal = React.memo(EmojiDetailModalElement);
