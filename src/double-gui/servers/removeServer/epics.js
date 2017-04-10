import { Observable } from 'rxjs';
import { INIT } from './actions';
import { remove } from '../../entities/servers/actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch({
        host: 'http://127.0.0.1',
        url: '/remove-server',
        port: 3060,
        method: 'POST',
        payload: { id: action.id }
      }).then(() => action.id)
    ))
    .map(remove);
