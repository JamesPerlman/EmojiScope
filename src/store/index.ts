import createSagaMiddleware from '@redux-saga/core';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const middleware = applyMiddleware(sagaMiddleware, logger);

export const store = createStore(rootReducer, middleware);

sagaMiddleware.run(rootSaga);

export * from './actionCreators';
export * from './useTypedDispatch';
export * from './useTypedSelector';
