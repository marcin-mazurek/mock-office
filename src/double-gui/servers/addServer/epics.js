import { Observable } from 'rxjs';
import { add } from '../../entities/servers/actions';
import { INIT } from './actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { name, port, serverType: type, isSecure, keyPath, certPath } = action;
      return Observable.from(
        fetch({
          host: 'http://127.0.0.1',
          url: '/add-server',
          port: 3060,
          method: 'POST',
          payload: { name, port, serverType: type, isSecure, keyPath, certPath }
        }).then(
          (response) => {
            const serverId = response.json().id;
            return [name, port, type, serverId, isSecure];
          }
        )
      );
    })
    .map(serverConfig => add(...serverConfig)
    );
