import { Observable } from 'rxjs';
import { remote } from 'electron';
import { stop } from '../actions';
import { INIT } from './actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.concat(
      Observable.fromPromise(
        remote.require('./main/serversHub').default.stop(action.id)
      ),
      Observable.of(action.id)
    ))
    .skip(1)
    .map(stop);
