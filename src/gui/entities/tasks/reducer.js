import { List, Map } from 'immutable';
import { ADD, REMOVE } from './actions';
import Task from './Task';
import { RESTORE_STATE as APP_RESTORE_STATE } from '../../appSync/actions';

const initialState = new Map({
  ids: new List(),
  entities: new Map()
});

const addTask = (state, id, params) =>
  state.update('ids', ids => ids.push(id))
    .setIn(
      ['entities', id],
      new Task(
        Object.assign({ id }, params)
      )
    );

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { taskId, params } = action;
      return addTask(state, taskId, params);
    }
    case REMOVE: {
      const { taskId } = action;
      return state
        .update('ids', ids => ids.filter(id => id !== taskId))
        .deleteIn(['entities', taskId]);
    }
    case APP_RESTORE_STATE: {
      const { servers } = action;
      let newState = state;
      servers.forEach(server =>
        server.mocks.forEach(mock =>
          mock.tasks.forEach((task) => {
            newState = addTask(newState, task.id, task);
          })
        )
      );
      return newState;
    }
    default: {
      return state;
    }
  }
};
