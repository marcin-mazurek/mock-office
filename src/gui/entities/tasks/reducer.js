import { List, Map } from 'immutable';
import { ADD, REMOVE } from './actions';
import Task from './Task';

const initialState = new Map({
  ids: new List(),
  entities: new Map()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { taskId, params } = action;
      let newState = state;
      newState = newState.update('ids', ids => ids.push(taskId));
      newState = newState.setIn(
        ['entities', taskId],
        new Task(
          Object.assign({ id: taskId }, params)
        )
      );
      return newState;
    }
    case REMOVE: {
      const { taskId } = action;
      return state
        .update('ids', ids => ids.filter(id => id !== taskId))
        .deleteIn(['entities', taskId]);
    }
    default: {
      return state;
    }
  }
};
