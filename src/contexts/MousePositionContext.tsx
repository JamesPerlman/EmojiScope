import React from 'react';
import { useMousePosition } from '../hooks';
import { origin2D, Point2D } from '../libs';

export type MousePositionContextValueType = {
  mousePosition: Point2D;
};

export const MousePositionContext = React.createContext<MousePositionContextValueType>({
  mousePosition: origin2D,
});

export type MousePositionContextProviderProps = React.PropsWithChildren<{
  transformMousePosition?: (inputMousePosition: Point2D) => Point2D
}>;

export const MousePositionContextProvider: React.FC<MousePositionContextProviderProps> = (
  props,
) => {
  const { children, transformMousePosition } = props;

  let mousePosition = useMousePosition();

  if (transformMousePosition !== undefined) {
    mousePosition = transformMousePosition(mousePosition);
  }

  return (
    <MousePositionContext.Provider value={{ mousePosition }}>
      {children}
    </MousePositionContext.Provider>
  );
};

export type MousePositionContextConsumerProps = React.PropsWithChildren<{}>;

export const MousePositionContextConsumer = MousePositionContext.Consumer;
