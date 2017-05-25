import { Observable } from 'rxjs';
import { stopAction } from '../../entities/servers/actions';
import { INITIALIZED } from './actions';

export default action$ =>
  action$.ofType(INITIALIZED)
    .flatMap(action => Observable.from(
      fetch('http://127.0.0.1:3060/stop-server', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: action.id })
      }).then(() => action.id)
    ))
    .map(stopAction);
