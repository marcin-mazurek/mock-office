import { List, Map } from 'immutable';
import { LOAD, UNLOAD } from '../dashboard/MockList/actions';

const MOCKS = {
  1: {
    id: '1',
    request: {
      url: '/some-url-1'
    },
    response: {
      body: {
        data: [
          'item1',
          'item2'
        ]
      }
    }
  },
  2: {
    id: '2',
    request: {
      url: '/some-url-2'
    },
    response: {
      body: {
        data: [
          'item1',
          'item3'
        ]
      }
    }
  }
};

const initialState = new Map({
  itemsById: new Map(MOCKS),
  unloadedIds: new List(['1', '2']),
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
    default: {
      return state;
    }
  }
};
