import { Observable } from 'rxjs';
import { INIT } from './actions';
import { start } from '../../entities/servers/actions';
import { add } from '../../entities/errors/actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch({
        host: 'http://127.0.0.1',
        url: '/start-server',
        port: 3060,
        method: 'POST',
        payload: { id: action.id }
      }).then(() => action.id)
    ))
    .map(id => start(id))
    .catch(reason => Observable.of(add(reason)));
