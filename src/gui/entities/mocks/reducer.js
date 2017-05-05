import { Map, List } from 'immutable';
import { REMOVE, FINISH } from '../../mocks/removeMock/actions';
import { ADD } from '../../mocks/addMock/actions';
import { RUN, STOP } from '../../mocks/runMock/actions';
import Mock from './Mock';

const initialState = new Map();

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { id } = action;
      const mockConfig = Object.keys(action).reduce((acc, next) => {
        const cfg = acc;
        if (action[next]) {
          cfg[next] = action[next];
        }

        return cfg;
      }, {});
      if (mockConfig.tasks) {
        mockConfig.tasks = new List(mockConfig.tasks.map(task => task.id));
      }
      const mock = new Mock(mockConfig);

      return state.set(id, mock);
    }
    case REMOVE: {
      return state.remove(action.mockId);
    }
    case FINISH: {
      return state.setIn([action.mockId, 'finished'], true);
    }
    case STOP: {
      const prevState = state.get(action.taskId);
      return state.mergeIn([action.taskId], {
        running: false,
        lastDuration: Date.now() - prevState.get('lastRunTimestamp')
      });
    }
    case RUN: {
      const prevState = state.get(action.taskId);
      return state.mergeIn([action.taskId], {
        running: true,
        runCount: prevState.get('runCount') + 1,
        lastRunTimestamp: Date.now(),
        lastDuration: null
      });
    }
    default: {
      return state;
    }
  }
};
