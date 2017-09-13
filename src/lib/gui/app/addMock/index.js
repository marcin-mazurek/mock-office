import { Map } from 'immutable';
import { ADD_MOCK_BUTTON_CLICKED } from '../../components/InspectServer/actions';
import { OVERLAY_CLICKED } from '../../components/Modal/actions';

const initialState = new Map({
  server: '',
  scenario: '',
  serverType: ''
});
const setServer = params => new Map({
  server: params.server,
  scenario: params.scenario,
  serverType: params.serverType
});
const resetServer = state => state.delete('id');
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MOCK_BUTTON_CLICKED: {
      return setServer(action);
    }
    case OVERLAY_CLICKED: {
      return resetServer(state);
    }
    default: {
      return state;
    }
  }
};

export default reducer;
