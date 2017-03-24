import { Map, Record, List } from 'immutable';
import { ADD as ADD_SERVER } from '../servers/actions';
import { REMOVE as REMOVE_DESCRIPTION } from '../descriptions/removeDescription/actions';
import { ADD as ADD_DESCRIPTION } from '../descriptions/addDescription/actions';

const initialState = new Map();

const Queue = new Record({
  descriptions: new List()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_SERVER: {
      const queue = new Queue();
      return state.set(action.id, queue);
    }
    case ADD_DESCRIPTION: {
      return state.updateIn([action.serverId, 'descriptions'], descriptions => descriptions.push(action.id));
    }
    case REMOVE_DESCRIPTION: {
      return state.updateIn([action.serverId, 'descriptions'], (descriptions) => {
        const descriptionIndex = descriptions.findIndex(descriptionId => descriptionId === action.descriptionId);
        return descriptions.delete(descriptionIndex, 1);
      });
    }
    default: {
      return state;
    }
  }
};
