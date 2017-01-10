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
      return R.invoker(2, 'set')('itemsById', R.pipe(
        R.invoker(1, 'get')('itemsById'),
        R.invoker(2, 'set')(action.id,
          R.pipe(
            R.pick(['name', 'port', 'id', 'serverType']),
            R.over(
              R.lens(R.prop('serverType'), R.assoc('type')),
              R.identity
            ),
            R.construct(Server)
          )(action)
        ),
      )(state), state);
    }
    case SELECT: {
      return R.invoker(2, 'set')('selected', action.id, state);
    }
    case START: {
      return R.invoker(2, 'set')('running', R.pipe(
        R.invoker(1, 'get')('running'),
        R.invoker(1, 'add')(action.id)
        )(state),
        state
      );
    }
    case STOP: {
      return R.invoker(2, 'set')('running',
        R.pipe(
          R.invoker(1, 'get')('running'),
          R.invoker(1, 'delete')(action.id),
        )(state),
        state);
    }
    default: {
      return state;
    }
  }
};
