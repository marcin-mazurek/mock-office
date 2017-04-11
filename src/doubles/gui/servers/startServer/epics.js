import { Observable } from 'rxjs';
import { INIT } from './actions';
import { start } from '../../entities/servers/actions';
import { add } from '../../entities/errors/actions';

export default action$ =>
  action$.ofType(INIT)
    .flatMap(action =>
      Observable.from(
        fetch('http://127.0.0.1:3060/start-server',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: action.id })
          })
          .then(res => res.json())
          .then((res) => {
            if (res.error) {
              throw new Error(res.error);
            }

            return res.id;
          })
      )
        .map(id => start(id))
        .catch(err => Observable.of(add(err.message)))
    );
