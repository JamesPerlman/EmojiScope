import React, { useContext } from 'react';

type ReactiveGridItemContextValueType = {
  itemStyle: React.CSSProperties;
};

const ReactiveGridItemContext = React.createContext<ReactiveGridItemContextValueType>({
  itemStyle: {},
});

export const useReactiveGridItemContext = () => useContext(ReactiveGridItemContext);

export type ReactiveGridItemContextProviderProps = React.PropsWithChildren<{
  itemStyle: React.CSSProperties;
}>;

export const ReactiveGridItemContextProvider: React.FC<ReactiveGridItemContextProviderProps> = (
  props,
) => {
  const { itemStyle, children } = props;

  const contextValue: ReactiveGridItemContextValueType = {
    itemStyle,
  };
  return (
    <ReactiveGridItemContext.Provider value={contextValue}>
      {children}
    </ReactiveGridItemContext.Provider>
  );
};

export const ReactiveGridItemContextConsumer = ReactiveGridItemContext.Consumer;
