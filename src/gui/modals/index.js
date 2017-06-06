import { Map } from 'immutable';
import { OVERLAY_CLICKED, createModalConnect } from './Modal';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../servers/addServer/epics';
import { ADD_BUTTON_CLICKED } from '../sidebar/SideBarServers';
import createReduxModule from '../utils/createReduxModule';

const initialState = new Map({
  component: ''
});
const reducers = {
  openModal(state, component) {
    return state.set('component', component);
  },
  closeModal(state) {
    return state.delete('component');
  }
};
const selectors = {
  modalSelector: state => state.get('component')
};
const stateGetter = state => state.get('modals');
const components = {
  ModalConnect: createModalConnect
};
const actionHandlers = {
  [ADD_SERVER_SUCCEED]: (state, action, partialReducers) =>
    partialReducers.closeModal(state),
  [ADD_BUTTON_CLICKED]: (state, action, partialReducers) =>
    partialReducers.openModal(state, 'addServerModal'),
  [OVERLAY_CLICKED]: (state, action, partialReducers) =>
    partialReducers.closeModal(state)
};

export default createReduxModule(
  {
    initialState,
    reducers,
    selectors
  }
)(
  actionHandlers,
  stateGetter,
  components
);
