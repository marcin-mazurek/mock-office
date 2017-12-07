import { createReducer } from 'modalo';
import { ADD_BUTTON_CLICKED } from '../../components/SidebarServers/SideBarServers';
import { ADD_BEHAVIOUR_BUTTON_CLICKED } from '../../components/ServerViewHeader/actions';
import { FORM_SUBMITTED } from '../../components/AddHttpBehaviourForm';
import { SUCCEED } from '../../epics/addBehaviour/actions';
import { SUCCEEDED as ADD_SERVER_SUCCEED } from '../../epics/addServer/actions';

export default createReducer({
  [ADD_BUTTON_CLICKED]: reduce => reduce('openModal', 'AddServerModal'),
  [ADD_SERVER_SUCCEED]: reduce => reduce('closeModal'),
  [ADD_BEHAVIOUR_BUTTON_CLICKED]: reduce => reduce('openModal', 'AddBehaviourModal'),
  [FORM_SUBMITTED]: reduce => reduce('closeModal'),
  [SUCCEED]: reduce => reduce('closeModal')
});
