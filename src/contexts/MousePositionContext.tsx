import React from 'react';
import { useMousePosition } from '../hooks';
import { origin2D, Point2D } from '../libs';

export type MousePositionContextValueType = {
  mousePosition: Point2D;
};

const MousePositionContext = React.createContext<MousePositionContextValueType>({
  mousePosition: origin2D,
});

export type MousePositionContextProviderProps = React.PropsWithChildren<{}>;

export const MousePositionContextProvider: React.FC<MousePositionContextProviderProps> = (props) => {
  const { children } = props;

  const mousePosition = useMousePosition();

  return (
    <MousePositionContext.Provider value={{ mousePosition }}>
      {children}
    </MousePositionContext.Provider>
  );
};

export type MousePositionContextConsumerProps = React.PropsWithChildren<{}>;

export const MousePositionContextConsumer = MousePositionContext.Consumer;
