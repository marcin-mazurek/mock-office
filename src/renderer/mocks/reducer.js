import { Map, Set, List } from 'immutable';
import { ADD, LOAD, UNLOAD } from './actions';

const initialState = new Map({
  itemsById: new Map(),
  itemsByServer: new Map(),
  loaded: new List()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const { expectationId, instanceId } = action;

      return state.set('loaded',
        state.get('loaded').push({ instanceId, expectationId })
      );
    }
    case UNLOAD: {
      const { expectationId } = action;

      return state.set('loaded',
        state.get('loaded').filter(expectation => expectation.instanceId !== expectationId)
      );
    }
    case ADD: {
      const { serverId, expectations } = action;
      let newState = state;
      const expectationsById = expectations.reduce(
        (prev, next) => {
          const reducedExpectations = prev;
          reducedExpectations[next.id] = next;
          return reducedExpectations;
        }, {}
      );

      if (!newState.get('itemsByServer').get(serverId)) {
        newState = newState.setIn(['itemsByServer', serverId],
          Set.of(...expectations.map(ex => ex.id)));
      } else {
        newState = newState.setIn(['itemsByServer', 'serverId'],
          newState.getIn(['itemsByServer', serverId])
            .concat(Set.of(...expectations.map(ex => ex.id)))
        );
      }

      return newState.set('itemsById', newState.get('itemsById').merge(expectationsById));
    }
    default: {
      return state;
    }
  }
};
