import { remote } from 'electron';
import { Observable } from 'rxjs';
import { INIT } from './actions';
import { start } from '../actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.concat(
      Observable.fromPromise(remote.require('./main/servers').default.start(action.id)),
      Observable.of(action.id)
    ))
    .skip(1)
    .map(start);
