import { Map } from 'immutable';
import { ADD_BEHAVIOUR_BUTTON_CLICKED } from '../../components/ServerViewHeader/actions';

const initialState = new Map({
  server: '',
  scenario: '',
  serverType: ''
});
const setTargetProps = params => new Map({
  serverId: params.serverId,
  serverType: params.serverType
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BEHAVIOUR_BUTTON_CLICKED: {
      return setTargetProps(action);
    }
    default: {
      return state;
    }
  }
};

export default reducer;
