import { Map } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = new Map({
  currentDisplayedServerId: ''
});

const resetCurrentDisplayedServer = state =>
  state.delete('currentDisplayedServerId');

const setCurrentDisplayedServer = (state, serverId) =>
  state.set('currentDisplayedServerId', serverId);

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE: {
      const splitPathName = action.payload.pathname.split('/');
      let serverId;
      splitPathName.forEach((urlPart, index) => {
        if (splitPathName[index - 1] && splitPathName[index - 1] === 'server') {
          serverId = urlPart;
        }
      });

      if (serverId) {
        return setCurrentDisplayedServer(state, serverId);
      }

      return resetCurrentDisplayedServer(state);
    }
    default: {
      return state;
    }
  }
}
