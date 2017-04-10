import { Observable } from 'rxjs';
import { stop } from '../../entities/servers/actions';
import { INIT } from './actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.from(
      fetch({
        host: 'http://127.0.0.1',
        url: '/stop-server',
        port: 3060,
        method: 'POST',
        payload: { id: action.id }
      }).then(() => action.id)
    ))
    .map(stop);
