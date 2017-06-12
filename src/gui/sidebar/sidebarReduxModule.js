import { Map } from 'immutable';
import configureReduxModule from '../utils/createReduxModule';

export default configureReduxModule(
  {
    initialState: new Map({
      currentDisplayedServerId: ''
    }),
    reducers: {
      resetCurrentDisplayedServer(state) {
        return state.delete('currentDisplayedServerId');
      },
      setCurrentDisplayedServer(state, serverId) {
        return state.set('currentDisplayedServerId', serverId);
      }
    },
    selectors: {
      currentDisplayedServerSelector: state => state.get('currentDisplayedServerId')
    }
  }
);
