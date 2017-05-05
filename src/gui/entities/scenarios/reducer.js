import { Map, Record, List } from 'immutable';
import { ADD as ADD_SERVER } from '../servers/actions';
import { REMOVE as REMOVE_MOCK } from '../../mocks/removeMock/actions';
import { ADD as ADD_MOCK } from '../../mocks/addMock/actions';

const initialState = new Map();

const Scenario = new Record({
  mocks: new List()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_SERVER: {
      const scenario = new Scenario();
      return state.set(action.id, scenario);
    }
    case ADD_MOCK: {
      return state.updateIn([action.serverId, 'mocks'], mocks => mocks.push(action.id));
    }
    case REMOVE_MOCK: {
      return state.updateIn([action.serverId, 'mocks'], (mocks) => {
        const mockIndex =
          mocks.findIndex(mockId => mockId === action.mockId);
        return mocks.delete(mockIndex, 1);
      });
    }
    default: {
      return state;
    }
  }
};
