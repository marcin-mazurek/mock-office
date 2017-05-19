import { Map, List } from 'immutable';
import { ADD, REMOVE, FINISH, RUN, STOP } from './actions';
import Mock from './Mock';
import { ADD as ADD_TASK } from '../tasks/actions';

const initialState = new Map({
  entities: new Map(),
  ids: new List()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { mockId, params } = action;

      params.tasks = new List();
      const mock = new Mock(
        Object.assign(
          { id: mockId },
          Object.assign({}, params)
        )
      );

      return state
        .setIn(['entities', mockId], mock)
        .update('ids', ids => ids.push(mockId));
    }
    case REMOVE: {
      const { mockId } = action;

      return state
        .update('ids', ids => ids.filter(id => id !== mockId))
        .deleteIn(['entities', mockId]);
    }
    case FINISH: {
      return state.setIn(['entities', action.mockId, 'finished'], true);
    }
    case STOP: {
      const { id } = action;
      const prevState = state.getIn(['entities', id]);
      return state.mergeIn(['entities', id], {
        running: false,
        lastDuration: Date.now() - prevState.get('lastRunTimestamp')
      });
    }
    case RUN: {
      const { id } = action;
      const prevState = state.getIn(['entities', id]);
      return state.mergeIn([id], {
        running: true,
        runCount: prevState.get('runCount') + 1,
        lastRunTimestamp: Date.now(),
        lastDuration: null
      });
    }
    default: {
      return state;
    }
    case ADD_TASK: {
      const { taskId, mockId } = action;
      return state.updateIn(['entities', mockId, 'tasks'], tasks => tasks.push(taskId));
    }
  }
};
