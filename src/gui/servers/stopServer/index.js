import { Observable } from 'rxjs';
import { has, ifElse } from 'ramda';
import api from '../../resources/api';

export const SUCCEEDED = 'stopServer/SUCCEEDED';

export const succeededAction = id => ({
  type: SUCCEEDED,
  id
});

export const FAILED = 'stopServer/FAILED';
export const failedAction = reason => ({
  type: FAILED,
  reason
});
const hasError = has('error');
const onSuccess = result => succeededAction(result.data.id);
const onFail = result => failedAction(result.error);

export default action$ =>
  action$
    .flatMap(action => Observable.from(api.stopServer({ id: action.id })))
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
