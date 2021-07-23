import React from 'react';
import { useReactiveGridItemContext } from '../../../contexts';
import { Size2D } from '../../../libs';
import { Emoji } from '../../../models';
import { ModalActionCreator, useTypedDispatch } from '../../../store';
import { Modal } from '../../../types';
import { EmojiView } from '../atoms';

interface EmojiButtonProps {
  emoji: Emoji;
  itemSize: Size2D;
}

const EmojiButtonElement = (props: EmojiButtonProps) => {
  const { emoji, itemSize } = props;
  const dispatch = useTypedDispatch();
  const context = useReactiveGridItemContext();

  const handleClick = () => {
    dispatch(
      ModalActionCreator.show(Modal.EmojiDetailView, {
        emoji,
        reactiveItemStyles: context.itemStyle,
      }),
    );
  };
  return (
    <a className="cursor-pointer" onClick={handleClick}>
      <EmojiView char={emoji.character} itemSize={itemSize} />
    </a>
  );
};

export const EmojiButton = React.memo(EmojiButtonElement);
