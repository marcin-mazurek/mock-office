import { createReducer } from '../../modules/react-redux-modal';
import { ADD_BUTTON_CLICKED } from '../../components/SidebarServers/SideBarServers';
import { SUBMIT_BUTTON_CLICKED } from '../../components/AddServerForm/actions';
import { ADD_MOCK_BUTTON_CLICKED } from '../../components/InspectServer/actions';

export default createReducer({
  [ADD_BUTTON_CLICKED]: reduce => reduce('openModal', 'AddServerModal'),
  [SUBMIT_BUTTON_CLICKED]: reduce => reduce('closeModal'),
  [ADD_MOCK_BUTTON_CLICKED]: reduce => reduce('openModal', 'AddMockModal')
});
