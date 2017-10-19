import { createReducer } from 'modalo';
import { ADD_BUTTON_CLICKED } from '../../components/SidebarServers/SideBarServers';
import { SUBMIT_BUTTON_CLICKED } from '../../components/AddServerForm/actions';
import { ADD_MOCK_BUTTON_CLICKED } from '../../components/ServerViewHeader/actions';
import { FORM_SUBMITTED } from '../../components/AddHttpMockForm';
import { SUCCEED } from '../../epics/addMock';

export default createReducer({
  [ADD_BUTTON_CLICKED]: reduce => reduce('openModal', 'AddServerModal'),
  [SUBMIT_BUTTON_CLICKED]: reduce => reduce('closeModal'),
  [ADD_MOCK_BUTTON_CLICKED]: reduce => reduce('openModal', 'AddMockModal'),
  [FORM_SUBMITTED]: reduce => reduce('closeModal'),
  [SUCCEED]: reduce => reduce('closeModal')
});
