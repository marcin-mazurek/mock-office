import { Map } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

export default function sidebarReducer(state = new Map(), action) {
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
        return state.set('currentDisplayedServerId', serverId);
      }

      return state.delete('currentDisplayedServerId');
    }
    default: {
      return state;
    }
  }
}
