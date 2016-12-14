import { List, Map } from 'immutable';
import { LOAD, UNLOAD } from './actions';

const initialState = new Map({
  itemsById: new Map({}),
  unloadedIds: new List([]),
  loadedIds: new List([])
});

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const { id } = action;
      const loadedIds = state.get('loadedIds').push(id);
      let unloadedIds = state.get('unloadedIds');
      const indexOfMockToUnload = unloadedIds.findIndex(mockId => mockId === id);
      unloadedIds = unloadedIds.delete(indexOfMockToUnload);

      return state
        .set('loadedIds', loadedIds)
        .set('unloadedIds', unloadedIds);
    }
    case UNLOAD: {
      const { id } = action;
      const unloadedIds = state.get('unloadedIds').push(id);
      let loadedIds = state.get('loadedIds');
      const indexOfMockToUnload = loadedIds.findIndex(mockId => mockId === id);
      loadedIds = loadedIds.delete(indexOfMockToUnload);

      return state
        .set('loadedIds', loadedIds)
        .set('unloadedIds', unloadedIds);
    }
    case 'mocks/LOAD_MOCKS': {
      const { mocks } = action;
      const mocksById = mocks.reduce(
        (prev, next) => {
          const reducedMocks = prev;
          reducedMocks[next.id] = next;
          return reducedMocks;
        }, {}
      );
      let newState = state.set('unloadedIds', new List(mocks.map(mock => mock.id)));
      newState = newState.set('itemsById', new Map(mocksById));
      return newState;
    }
    default: {
      return state;
    }
  }
};
