import { Map, Record, List } from 'immutable';
import { ADD, REMOVE } from './actions';
import { ADD as ADD_MOCK, REMOVE as REMOVE_MOCK } from '../mocks/actions';

const initialState = new Map({
  entities: new Map(),
  ids: new List()
});

const Scenario = new Record({
  id: '',
  mocks: new List()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { id } = action;
      const params = {
        id
      };

      const scenario = new Scenario(Object.assign(params, { id }));

      return state
        .setIn(['entities', id], scenario)
        .update('ids', ids => ids.push(id));
    }
    case REMOVE: {
      const { id } = action;
      return state
        .update('ids', ids => ids.filter(scenarioId => scenarioId !== id))
        .deleteIn(['entities', id]);
    }
    case ADD_MOCK: {
      return state.updateIn(['entities', action.scenarioId, 'mocks'],
        mocks => mocks.push(action.mockId)
      );
    }
    case REMOVE_MOCK: {
      return state.updateIn(['entities', action.scenarioId, 'mocks'],
        mocks => mocks.filter(mock => mock !== action.mockId)
      );
    }
    default: {
      return state;
    }
  }
};
