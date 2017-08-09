import { Map } from 'immutable';
import { SUCCEEDED as ADD_SERVER_SUCCEED } from '../../servers/addServer/epics';
import { ADD_BUTTON_CLICKED } from '../../sidebar/SidebarServers/SideBarServers';
import { ADD_MOCK_BUTTON_CLICKED } from '../../servers/inspectServer/InspectServer';
import { FORM_SUBMITTED as WS_MOCK_FORM_SUBMITTED } from '../../mocks/addMock/addWsMock/AddWsMockForm';
import { FORM_SUBMITTED as HTTP_MOCK_FORM_SUBMITTED } from '../../mocks/addMock/addHttpMock/AddMockForm';
import { OVERLAY_CLICKED } from '../../components/Modal/actions';

const initialState = new Map();
const openModal = (state, component) => state.set('component', component);
const closeModal = state => state.delete('component');

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SERVER_SUCCEED:
    case WS_MOCK_FORM_SUBMITTED:
    case HTTP_MOCK_FORM_SUBMITTED:
    case OVERLAY_CLICKED: {
      return closeModal(state);
    }
    case ADD_BUTTON_CLICKED: {
      return openModal(state, 'AddServerModal');
    }
    case ADD_MOCK_BUTTON_CLICKED: {
      return openModal(state, 'AddMockModal');
    }
    default: {
      return state;
    }
  }
};
