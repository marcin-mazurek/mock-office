import { Map, Set, Record } from 'immutable';
import R from 'ramda';
import unique from 'node-unique';
import { ADD } from '../servers/actions';
import { RUN } from './actions';

const initialState = new Map({
  itemsByServer: new Map(),
  itemsById: new Map(),
  running: new Set()
});

const Script = new Record({
  name: '',
  content: '',
  id: ''
});

export default (state = initialState, action) => {
  switch (action.type) {
    case 'serverScripts/ADD': {
      const { serverId, content, name } = action;
      const scriptId = unique();

      return R.pipe(
        R.pipe(
          R.invoker(1, 'getIn')(
            ['itemsByServer', serverId],
          ),
          R.invoker(1, 'add')(scriptId),
          R.invoker(2, 'setIn')(
            ['itemsByServer', serverId],
            R.__,
            state
          ),
        ),
        R.invoker(2, 'setIn')(
          ['itemsById', scriptId],
          new Script({ name, content, id: scriptId })
        )
      )(state);
    }
    case ADD: {
      return R.pipe(
        R.construct(Set),
        R.invoker(2, 'setIn')(['itemsByServer', action.id], R.__, state)
      )([]);
    }
    case RUN: {
      return R.pipe(
        R.invoker(1, 'get')('running'),
        R.invoker(1, 'add')(
          action.script
        ),
        R.invoker(2, 'set')(
          'running',
          R.__,
          state
        )
      )(state);
    }
    default: {
      return state;
    }
  }
};
