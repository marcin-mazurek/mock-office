import { Observable } from 'rxjs';
import { INIT } from './actions';
import { start } from '../../entities/servers/actions';
import { add } from '../../entities/notifications/actions';
import { requestStartServer } from '../../api/api';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action =>
      Observable.from(requestStartServer(action.id))
        .map(res => start(res.id))
        .catch(err => Observable.of(add({ text: err.message, type: 'error' })))
    );
