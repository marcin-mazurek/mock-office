import { SUCCEEDED as ADD_SERVER_SUCCEED } from '../servers/addServer/epics';
import { ADD_BUTTON_CLICKED } from '../sidebar/SidebarServers/SideBarServers';
import { ADD_MOCK_BUTTON_CLICKED } from '../servers/inspectServer/InspectServer';
import { FORM_SUBMITTED as WS_MOCK_FORM_SUBMITTED } from '../mocks/addMock/addWsMock/AddWsMockForm';
import { FORM_SUBMITTED as HTTP_MOCK_FORM_SUBMITTED } from '../mocks/addMock/addHttpMock/AddMockForm';
import { modalsModuleFactory, createModalConnect, createModal } from '../modules/modals';
import AddServerModal from './AddServerModal';
import AddMockModal from './AddMockModal';

const closeModal = (state, action, reducers) => reducers.closeModal(state);
const modalsModule = modalsModuleFactory(
  {
    [ADD_SERVER_SUCCEED]: closeModal,
    [ADD_BUTTON_CLICKED]: (state, action, reducers) =>
      reducers.openModal(state, 'addServerModal'),
    [WS_MOCK_FORM_SUBMITTED]: closeModal,
    [HTTP_MOCK_FORM_SUBMITTED]: closeModal,
    [ADD_MOCK_BUTTON_CLICKED]: (state, action, reducers) =>
      reducers.openModal(state, 'addMockModal')
  },
  state => state.get('modals')
);

const types = {
  addServerModal: AddServerModal,
  addMockModal: AddMockModal
};
export const Modal = createModal(types);
export const ModalConnect = createModalConnect(Modal, modalsModule.selectors);

export const reducer = modalsModule.reducer;
