import { createReducer, addNotification } from '../../modules/notifications/lib';
import {
  SUCCEEDED as ADD_SERVER_SUCCEEDED,
  FAILED as ADD_SERVER_FAILED
} from '../../epics/addServer/actions';
import { FAILED as EDIT_SERVER_FAILED } from '../../epics/editServer/actions';
import {
  FAILED as REMOVE_SERVER_FAILED,
  SUCCEEDED as REMOVE_SERVER_SUCCEEDED
} from '../../epics/removeServer/actions';
import {
  SUCCEEDED as IMPORT_BEHAVIOURS_SUCCEEDED,
  FAILED as IMPORT_BEHAVIOURS_FAILED
} from '../../epics/importBehaviour';
import {
  SUCCEED as ADD_BEHAVIOUR_SUCCEED,
  FAILED as ADD_BEHAVIOUR_FAILED
} from '../../epics/addBehaviour/actions';
import {
  FAILED as START_SERVER_FAILED
} from '../../epics/startServer/actions';
import { FAILED as STOP_SERVER_FAILED } from '../../epics/stopServer/actions';
import { SUBMIT_FAILED } from '../../components/AddHttpBehaviourForm/actions';
import { FAILED as REMOVE_BEHAVIOUR_FAILED } from '../../epics/removeBehaviour';

export default createReducer((state, action) => {
  switch (action.type) {
    case ADD_BEHAVIOUR_SUCCEED: {
      return addNotification(state, {
        type: 'success',
        text: 'Behaviour added'
      });
    }
    case IMPORT_BEHAVIOURS_SUCCEEDED: {
      return addNotification(state, {
        type: 'success',
        text: 'Behaviours imported'
      });
    }
    case EDIT_SERVER_FAILED:
    case REMOVE_SERVER_FAILED:
    case IMPORT_BEHAVIOURS_FAILED:
    case ADD_BEHAVIOUR_FAILED:
    case REMOVE_BEHAVIOUR_FAILED:
    case ADD_SERVER_FAILED:
    case START_SERVER_FAILED:
    case STOP_SERVER_FAILED:
    case SUBMIT_FAILED: {
      return addNotification(state, {
        type: 'error',
        text: action.reason
      });
    }
    case REMOVE_SERVER_SUCCEEDED: {
      return addNotification(state, {
        type: 'success',
        text: 'Server removed'
      });
    }
    case ADD_SERVER_SUCCEEDED: {
      return addNotification(state, {
        type: 'success',
        text: 'Server added'
      });
    }
    default: {
      return state;
    }
  }
});
