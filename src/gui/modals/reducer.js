import modalsReduxModule from './modalsReduxModule';
import { OVERLAY_CLICKED } from './Modal';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../servers/addServer/epics';
import { ADD_BUTTON_CLICKED } from '../sidebar/SideBarServers';

export default modalsReduxModule.createReducer({
  [ADD_SERVER_SUCCEED]: (state, action, reducers) =>
    reducers.closeModal(state),
  [ADD_BUTTON_CLICKED]: (state, action, reducers) =>
    reducers.openModal(state, 'addServerModal'),
  [OVERLAY_CLICKED]: (state, action, reducers) =>
    reducers.closeModal(state)
});
