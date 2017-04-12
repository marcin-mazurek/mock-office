import { Observable } from 'rxjs';
import { INIT } from './actions';
import { remove } from '../../entities/servers/actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch('http://127.0.0.1:3060/remove-server', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: action.id })
      })
        .then(() => action.id)
    ))
    .map(remove);
