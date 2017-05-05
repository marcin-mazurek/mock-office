import { List, Map } from 'immutable';
import { ADD } from '../../mocks/addMock/actions';
import Task from './Task';

const initialState = new Map({
  ids: new List(),
  entities: new Map()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      let newState = state;
      action.tasks.forEach((task) => {
        newState = newState.update('ids', ids => ids.push(task.id));
        newState = newState.setIn(
          ['entities', task.id],
          new Task(
            Object.assign({ id: task.id }, task)
          )
        );
      });
      return newState;
    }
    default: {
      return state;
    }
  }
};
