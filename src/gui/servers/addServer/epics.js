import { Observable } from 'rxjs';
import { add } from '../../entities/servers/actions';
import { INIT } from './actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { name, port, serverType: type, isSecure, keyPath, certPath } = action;
      return Observable.from(
        fetch('http://127.0.0.1:3060/add-server', {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ name, port, type, isSecure, keyPath, certPath })
        })
          .then(response => response.json())
          .then(
          (response) => {
            const serverId = response.id;
            return [name, port, type, serverId, isSecure];
          }
        )
      );
    })
    .flatMap(serverConfig =>
      [{ type: 'addServer/CLOSE_MODAL' }, add(...serverConfig)]
    );
