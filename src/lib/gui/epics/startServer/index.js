import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import api from '../../resources/api/index';
import { failedAction, succeededAction } from './actions';

const preparePayload = action => ({ id: action.id });
const makeRequest = action => Observable.from(api.startServer({ id: action.id }));
const onFail = result => failedAction(result.error);
const onSuccess = result => succeededAction(result.data.id);
const hasError = has('error');

export default action$ =>
  action$
    .map(preparePayload)
    .flatMap(makeRequest)
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
