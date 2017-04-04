import { remote } from 'electron';
import { Observable } from 'rxjs';
import { INIT } from './actions';
import { start } from '../../entities/servers/actions';
import { add } from '../../errors/actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.concat(
      Observable.fromPromise(
        remote.require('./main/servers').default.start(action.id)
      )
        .map(() => start(action.id))
        .catch(reason => Observable.of(add(reason))),
    ));
