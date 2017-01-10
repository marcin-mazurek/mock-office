import { Record, Map, Set } from 'immutable';
import R from 'ramda';
import {
  ADD,
  SELECT,
  START,
  STOP
} from './actions';

const Server = new Record({
  id: '',
  name: 'New Server',
  port: null,
  expectations: new Set(),
  type: ''
});

const initialState = new Map({
  itemsById: new Map(),
  selected: null,
  running: new Set()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return R.pipe(
        R.invoker(1, 'get')('itemsById'),
        R.invoker(2, 'set')(action.id,
          R.pipe(
            R.pick(['name', 'port', 'id', 'serverType']),
            R.over(
              R.lens(R.prop('serverType'), R.assoc('type')),
              obj => obj
            ),
            R.construct(Server)
          )(action)
        ),
        R.invoker(2, 'set')('itemsById', R.__, state)
      )(state);
    }
    case SELECT: {
      return R.invoker(2, 'set')('selected', action.id, state);
    }
    case START: {
      return R.pipe(
        R.invoker(1, 'get')('running'),
        R.invoker(1, 'add')(action.id),
        R.invoker(2, 'set')('running', R.__, state)
      )(state);
    }
    case STOP: {
      return R.pipe(
        R.invoker(1, 'get')('running'),
        R.invoker(1, 'delete')(action.id),
        R.invoker(2, 'set')('running', R.__, state)
      )(state);
    }
    default: {
      return state;
    }
  }
};
