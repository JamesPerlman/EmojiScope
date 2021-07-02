import React from 'react';
import { Node } from '../atoms';

interface NodeFieldProps {
  n: string,
}

const NodeFieldElement: React.FC<NodeFieldProps> = (props) => {
  const { n } = props;
  return (
    <div>
      <Node icon="coffee" />
    </div>
  )
}

export const NodeField = React.memo(NodeFieldElement);
