import React, { useCallback, useState } from 'react';
import Measure, { ContentRect } from 'react-measure';
import 'tailwindcss/tailwind.css';
import { Size2D } from '../../libs';
import { useSelectEmojis } from '../../store/emojiList/selectors';
import { EmojiButton, ReactiveGrid } from '../UI';

type EmojiBrowserPageProps = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EmojiBrowserPageElement: React.FC<EmojiBrowserPageProps> = (props) => {
  const emojis = useSelectEmojis();

  const [gridSize, setGridSize] = useState<Size2D>({ width: 0, height: 0 });

  const handleResize = useCallback((info: ContentRect) => {
    if (info?.bounds === undefined) {
      return;
    }

    const sideLength = 0.5 * Math.min(info.bounds.width, info.bounds.height);
    setGridSize({
      width: sideLength,
      height: sideLength,
    });
  }, []);

  return (
    <Measure bounds onResize={handleResize}>
      {({ measureRef }) => (
        <div
          ref={measureRef}
          className="w-full h-full"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <div
            className="p-4"
            style={{
              width: gridSize.width,
              height: gridSize.height,
            }}>
            <ReactiveGrid
              magnification={1}
              effectRadius={200}
              itemRadius={30}
              itemSpacing={20}
              items={emojis}
              renderItem={(item, index, itemSize) => (
                <EmojiButton emoji={item} itemSize={itemSize} />
              )}
            />
          </div>
        </div>
      )}
    </Measure>
  );
};

export const EmojiBrowserPage = React.memo(EmojiBrowserPageElement);
