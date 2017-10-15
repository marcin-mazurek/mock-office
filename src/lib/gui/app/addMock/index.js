import { Map } from 'immutable';
import { ADD_MOCK_BUTTON_CLICKED } from '../../components/ServerViewHeader/actions';

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
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MOCK_BUTTON_CLICKED: {
      return setServer(action);
    }
    default: {
      return state;
    }
  }
};

export default reducer;
