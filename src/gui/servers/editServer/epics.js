import { Observable } from 'rxjs';
import { INIT } from './actions';
import { update } from '../../entities/servers/actions';

const requestEditServer = (id, params) =>
  fetch('http://127.0.0.1:3060/edit-server', {
    method: 'POST',
    body: JSON.stringify(Object.assign({}, params, { id })),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 400 || res.status === 404) {
        return res.json().then(payload => ({ error: payload.error }));
      }

      return res;
    });

export default action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      // port is submitted as string
      // eslint-disable-next-line no-param-reassign
      action.values.port = parseInt(action.values.port, 10);
      return Observable.from(requestEditServer(action.id, action.values));
    })
    .map((res) => {
      const { id, ...params } = res;
      return update(id, params);
    });
