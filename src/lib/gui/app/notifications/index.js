import { createReducer } from 'mock-office-notifications';
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

export default createReducer(
  {
    [ADD_BEHAVIOUR_SUCCEED]: reduce => reduce('addNotification', {
      type: 'success',
      text: 'Behaviour added'
    }),
    [IMPORT_BEHAVIOURS_SUCCEEDED]: reduce => reduce('addNotification', {
      type: 'success',
      text: 'Behaviours imported'
    }),
    [EDIT_SERVER_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [REMOVE_SERVER_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [IMPORT_BEHAVIOURS_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [ADD_BEHAVIOUR_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [REMOVE_BEHAVIOUR_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [ADD_SERVER_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [START_SERVER_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [STOP_SERVER_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [SUBMIT_FAILED]: (reduce, action) => reduce('addNotification', {
      type: 'error',
      text: action.reason
    }),
    [REMOVE_SERVER_SUCCEEDED]: reduce => reduce('addNotification', {
      type: 'success',
      text: 'Server removed'
    }),
    [ADD_SERVER_SUCCEEDED]: reduce => reduce('addNotification', {
      type: 'success',
      text: 'Server added'
    })
  },
  true
);
