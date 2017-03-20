import { remote } from 'electron';
import { Observable } from 'rxjs';
import { INIT } from './actions';
import { remove } from '../actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action => Observable.concat(
      Observable.from(
        remote.require('./main/servers').default.remove(action.id)
      ),
      Observable.of(action.id)
    ))
    .skip(1)
    .map(remove);
