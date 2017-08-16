import { fromJS } from 'immutable';
import { createStore, compose, applyMiddleware } from 'redux';
import { hashHistory } from 'react-router';
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
import 'rxjs';
import { reducer } from './app';
import { epic } from './modules';

const epicMiddleware = createEpicMiddleware(epic);

const DEBUG = process.env.NODE_ENV !== 'production';

export default () => {
  const initialState = fromJS({});
  const routerMiddleware = createRouterMiddleware(hashHistory);
  const enhancer = compose(
    applyMiddleware(routerMiddleware, epicMiddleware),
    (DEBUG && window.devToolsExtension) ? window.devToolsExtension() : f => f
  );
  return createStore(reducer, initialState, enhancer);
};
