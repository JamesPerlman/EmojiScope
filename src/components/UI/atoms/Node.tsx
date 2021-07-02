import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-common-types';
import 'tailwindcss/tailwind.css';

interface NodeProps {
  icon: IconName
};

const NodeElement: React.FC<NodeProps> = (props) => {
  const { icon } = props;
  return (
    <div className="rounded w-5 h-5">
      <FontAwesomeIcon icon={icon} className="w-full h-full"/>
    </div>
  );
}

export const Node = React.memo(NodeElement);
