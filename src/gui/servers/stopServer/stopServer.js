import { Observable } from 'rxjs';

export const SUCCEEDED = 'stopServer/SUCCEEDED';

export const succeededAction = id => ({
  type: SUCCEEDED,
  id
});

export default action$ =>
  action$
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
    .map(succeededAction);
