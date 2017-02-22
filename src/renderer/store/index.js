import createSagaMiddleware from 'redux-saga';
import { fromJS } from 'immutable';
import { createStore, compose, applyMiddleware } from 'redux';
import { hashHistory } from 'react-router';
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
import 'rxjs';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';
import rootEpic from './rootEpic';

const epicMiddleware = createEpicMiddleware(rootEpic);

const DEBUG = process.env.NODE_ENV !== 'production';

export default () => {
  const initialState = fromJS({});
  const sagaMiddleware = createSagaMiddleware();
  const routerMiddleware = createRouterMiddleware(hashHistory);
  const enhancer = compose(
    applyMiddleware(sagaMiddleware, routerMiddleware, epicMiddleware),
    (DEBUG && window.devToolsExtension) ? window.devToolsExtension() : f => f
  );
  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(rootSaga);

  return store;
};
