import { OVERLAY_CLICKED } from './Modal';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../servers/addServer/epics';
import { ADD_BUTTON_CLICKED } from '../sidebar/SidebarServers/SideBarServers';
import modalsReduxModule from './modalsReduxModule';
import createModalConnect from './createModalConnect';

const modals = modalsReduxModule(
  {
    [ADD_SERVER_SUCCEED]: (state, action, reducers) =>
      reducers.closeModal(state),
    [ADD_BUTTON_CLICKED]: (state, action, reducers) =>
      reducers.openModal(state, 'addServerModal'),
    [OVERLAY_CLICKED]: (state, action, reducers) =>
      reducers.closeModal(state)
  },
  state => state.get('modals')
);
export const ModalConnect = createModalConnect(modals.selectors);
export const selectors = modals.selectors;
export const reducer = modals.reducer;
export { default as Modal } from './Modal';
