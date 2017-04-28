import { Observable } from 'rxjs';
import { INIT } from './actions';
import { update } from '../../entities/servers/actions';
import { add } from '../../entities/notifications/actions';
import requestEditServer from './rest';

export default function editServerEpic(action$) {
  return action$.ofType(INIT)
    .flatMap((action) => {
      // port is submitted as string
      // eslint-disable-next-line no-param-reassign
      action.values.port = parseInt(action.values.port, 10);
      return Observable.from(requestEditServer(action.id, action.values));
    })
    .map((res) => {
      if (res.data) {
        const { id, ...params } = res.data;
        return update(id, params);
      }

      return add({
        text: res.error,
        type: 'error'
      });
    });
}
