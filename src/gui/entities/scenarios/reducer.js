import { Map, Record, List } from 'immutable';
import { ADD, REMOVE } from './actions';
import { ADD as ADD_MOCK, REMOVE as REMOVE_MOCK } from '../mocks/actions';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../../servers/addServer/actions';

const initialState = new Map({
  entities: new Map(),
  ids: new List()
});

export const Scenario = new Record({
  id: '',
  mocks: new List()
});

const addScenario = (state, params) => {
  const scenario = new Scenario(params);

  return state
    .setIn(['entities', params.id], scenario)
    .update('ids', ids => ids.push(params.id));
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return addScenario(state, { id: action.id });
    }
    case REMOVE: {
      const { id } = action;
      return state
        .update('ids', ids => ids.filter(scenarioId => scenarioId !== id))
        .deleteIn(['entities', id]);
    }
    case ADD_MOCK: {
      return state.updateIn(['entities', action.scenario, 'mocks'],
        mocks => mocks.push(action.id)
      );
    }
    case REMOVE_MOCK: {
      return state.updateIn(['entities', action.scenarioId, 'mocks'],
        mocks => mocks.filter(mock => mock !== action.mockId)
      );
    }
    case ADD_SERVER_SUCCEED: {
      const { params: { data } } = action;
      return addScenario(state, { id: data.scenario });
    }
    default: {
      return state;
    }
  }
};
