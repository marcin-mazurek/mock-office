import { Map } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

export default function sidebarReducer(state = new Map(), action) {
  switch (action.type) {
    case LOCATION_CHANGE: {
      const pathname = action.payload.pathname;

      if (pathname.includes('/server/')) {
        const splitPathName = action.payload.pathname.split('/');
        return state.set('currentDisplayedServerId', splitPathName[splitPathName.length - 1]);
      }

      return state.delete('currentDisplayedServerId');
    }
    default: {
      return state;
    }
  }
}
