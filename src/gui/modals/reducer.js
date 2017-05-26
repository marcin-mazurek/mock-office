import { OVERLAY_CLICKED } from './Modal';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../servers/addServer/actions';
import { ADD_BUTTON_CLICKED } from '../sidebar/actions';
import { initialState, openModal, closeModal } from './module';

export default function addServerReducer(state = initialState(), action) {
  switch (action.type) {
    case ADD_SERVER_SUCCEED: {
      return closeModal(state);
    }
    case ADD_BUTTON_CLICKED: {
      return openModal(state, 'addServerModal');
    }
    case OVERLAY_CLICKED: {
      return closeModal(state);
    }
    default: {
      return state;
    }
  }
}
