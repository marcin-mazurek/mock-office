import { OVERLAY_CLICKED } from './Modal';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../servers/addServer/epics';
import { ADD_BUTTON_CLICKED } from '../sidebar/actions';
import { getInitialState, reducers } from './module';

export default function addServerReducer(state = getInitialState(), action) {
  switch (action.type) {
    case ADD_SERVER_SUCCEED: {
      return reducers.closeModal(state);
    }
    case ADD_BUTTON_CLICKED: {
      return reducers.openModal(state, 'addServerModal');
    }
    case OVERLAY_CLICKED: {
      return reducers.closeModal(state);
    }
    default: {
      return state;
    }
  }
}
