import { remote } from 'electron';
import { Observable } from 'rxjs';
import { INIT } from './actions';
import { start } from '../../entities/servers/actions';
import { add } from '../../entities/errors/actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.concat(
      Observable.fromPromise(
        remote.require('./main/double').default.start(action.id)
      )
        .map(() => start(action.id))
        .catch(reason => Observable.of(add(reason))),
    ));
