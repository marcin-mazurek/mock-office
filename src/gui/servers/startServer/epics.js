import { Observable } from 'rxjs';
import { INIT } from './actions';
import { start } from '../../entities/servers/actions';
import { add } from '../../entities/errors/actions';
import { requestStartServer } from '../../api/api';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action =>
      Observable.from(requestStartServer(action.id))
    )
    .map((res) => {
      if (res.errors) {
        return add(res.errors.map(error => error.message));
      }

      return start(res.id);
    });
