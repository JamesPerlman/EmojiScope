import React from 'react';
import { ReactiveGrid } from '../UI';

import 'tailwindcss/tailwind.css';

type EmojiBrowserPageProps = {};

const EmojiBrowserPageElement: React.FC<EmojiBrowserPageProps> = (props) => {
  return (
    <div className="w-full h-full p-4">
      <ReactiveGrid
        magnification={1.5}
        effectRadius={200}
        itemRadius={30}
        itemSpacing={10}
      />
    </div>
  );
};

export const EmojiBrowserPage = React.memo(EmojiBrowserPageElement);
