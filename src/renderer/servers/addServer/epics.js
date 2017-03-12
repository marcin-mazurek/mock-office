import { remote } from 'electron';
import { add } from '../actions';
import { INIT } from './actions';

export default action$ =>
  action$.ofType(INIT)
    .map((action) => {
      const { name, port, serverType: type, isSecure, keyPath, certPath } = action;
      const serversHub = remote.require('./main/serversHub').default;
      const serverId = serversHub.add(name, port, type, isSecure, keyPath, certPath);

      return [name, port, type, serverId];
    }).map(serverConfig => add(...serverConfig)
  );
