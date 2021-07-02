import React from 'react';
import 'tailwindcss/tailwind.css';

interface NodeProps {
  content: string;
  style?: React.CSSProperties;
}

const NodeElement: React.FC<NodeProps> = (props) => {
  const { content, style } = props;
  return (
    <div className="rounded w-5 h-5" style={style}>
      {content}
    </div>
  );
};

export const Node = React.memo(NodeElement);
