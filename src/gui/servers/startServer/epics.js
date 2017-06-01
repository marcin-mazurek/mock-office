import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import { INITIALIZED } from './actions';
import api from '../../resources/api';

export const SUCCEED = 'startServer/SUCCEED';
export const FAILED = 'startServer/FAILED';

export const succeedAction = id => ({
  type: SUCCEED,
  id
});

export const failedAction = reason => ({
  type: FAILED,
  reason
});

const preparePayload = action => ({ id: action.id });
const makeRequest = action => Observable.from(api.startServer({ id: action.id }));
const onFail = result => failedAction(result.error);
const onSuccess = result => succeedAction(result.data.id);
const hasError = has('error');

export default action$ =>
  action$.ofType(INITIALIZED)
    .map(preparePayload)
    .flatMap(makeRequest)
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
