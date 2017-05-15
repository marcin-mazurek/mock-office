import { Observable } from 'rxjs';
import { add } from '../../entities/servers/actions';
import { INIT } from './actions';
import requestAddServer from './rest';
import { add as addNotification } from '../../entities/notifications/actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { name, port, serverType, isSecure, keyPath, certPath } = action;
      return Observable.from(requestAddServer(name, port, serverType, isSecure, keyPath, certPath))
        .flatMap((response) => {
          const { data, error } = response;
          if (error) {
            return [addNotification({ type: 'error', text: error })];
          }

          const serverId = data.id;

          return [
            { type: 'addServer/CLOSE_MODAL' },
            add(name, port, serverType, serverId, isSecure)
          ];
        })
        .catch(error => [addNotification({ type: 'error', text: error.message })]);
    });
