import createSagaMiddleware from 'redux-saga';
import { fromJS } from 'immutable';
import { createStore, compose, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutable';
import { browserHistory } from 'react-router';
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import reducers from './reducers';
import rootSaga from './rootSaga';

export default () => {
  const initialState = fromJS({});
  const reducer = combineReducers(reducers);
  const sagaMiddleware = createSagaMiddleware();
  const routerMiddleware = createRouterMiddleware(browserHistory);
  const enhancer = compose(applyMiddleware(sagaMiddleware, routerMiddleware));
  const store = createStore(reducer, initialState, enhancer);
  sagaMiddleware.run(rootSaga);
  return store;
};
