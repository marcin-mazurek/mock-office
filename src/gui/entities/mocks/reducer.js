import { Map, List } from 'immutable';
import { ADD, REMOVE, FINISH, RUN, STOP } from './actions';
import Mock from './Mock';
import { ADD as ADD_TASK } from '../tasks/actions';
import { RESTORE_STATE as APP_RESTORE_STATE } from '../../appSync/actions';

const initialState = new Map({
  entities: new Map(),
  ids: new List()
});

const addMock = (state, id, params) => {
  const mock = new Mock(
    Object.assign(
      { id },
      Object.assign({}, params, { tasks: new List() })
    )
  );

  return state
    .setIn(['entities', id], mock)
    .update('ids', ids => ids.push(id));
};
const addTask = (state, id, task) =>
  state.updateIn(['entities', id, 'tasks'], tasks => tasks.push(task));

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return addMock(state, action.id, action.params);
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
    case APP_RESTORE_STATE: {
      let newState = state;

      action.servers.forEach(server =>
        server.mocks.forEach((mock) => {
          newState = addMock(newState, mock.id, mock);

          mock.tasks.forEach((task) => {
            newState = addTask(newState, mock.id, task.id);
          });
        })
      );

      return newState;
    }
    case ADD_TASK: {
      return addTask(state, action.mockId, action.taskId);
    }
    default: {
      return state;
    }
  }
};
