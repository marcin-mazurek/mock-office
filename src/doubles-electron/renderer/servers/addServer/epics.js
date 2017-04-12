import { remote } from 'electron';
import { add } from '../../entities/servers/actions';
import { INIT } from './actions';

export default action$ =>
  action$.ofType(INIT)
    .map((action) => {
      const { name, port, serverType: type, isSecure, keyPath, certPath } = action;
      const serversHub = remote.require('./main').double;
      const serverId = serversHub.add(name, port, type, isSecure, keyPath, certPath);

      return [name, port, type, serverId, isSecure];
    }).map(serverConfig => add(...serverConfig)
  );