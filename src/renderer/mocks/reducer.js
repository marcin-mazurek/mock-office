import { Map, Set } from 'immutable';
import { ADD, LOAD, UNLOAD } from './actions';

const initialState = new Map({
  itemsById: new Map(),
  loadedByServer: new Map()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const { serverId, expectationId } = action;
      let serverExpectationList = state.get('loadedByServer').get(serverId);

      if (!serverExpectationList) {
        serverExpectationList = Set.of(expectationId);
      } else {
        serverExpectationList = serverExpectationList.add(expectationId);
      }

      return state.set('loadedByServer',
        state.get('loadedByServer').set(serverId, serverExpectationList)
      );
    }
    case UNLOAD: {
      const { serverId, expectationId } = action;
      let serverExpectationList = state.get('loadedByServer').get(serverId);
      serverExpectationList = serverExpectationList.delete(expectationId);

      return state.set('loadedByServer',
        state.get('loadedByServer').set(serverId, serverExpectationList)
      );
    }
    case ADD: {
      const { expectations } = action;
      const expectationsById = expectations.reduce(
        (prev, next) => {
          const reducedExpectations = prev;
          reducedExpectations[next.id] = next;
          return reducedExpectations;
        }, {}
      );
      return state.set('itemsById', state.get('itemsById').merge(expectationsById));
    }
    default: {
      return state;
    }
  }
};
