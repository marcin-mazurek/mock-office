import { LOCATION_CHANGE } from 'react-router-redux';
import sidebarReduxModule from './sidebarReduxModule';

const sidebar = sidebarReduxModule(
  {
    [LOCATION_CHANGE]: (state, action, reducers) => {
      const splitPathName = action.payload.pathname.split('/');
      let serverId;
      splitPathName.forEach((urlPart, index) => {
        if (splitPathName[index - 1] && splitPathName[index - 1] === 'server') {
          serverId = urlPart;
        }
      });

      if (serverId) {
        return reducers.setCurrentDisplayedServer(state, serverId);
      }

      return reducers.resetCurrentDisplayedServer(state);
    }
  },
  state => state.get('sidebar')
);

export const reducer = sidebar.reducer;
export const selectors = sidebar.selectors;
