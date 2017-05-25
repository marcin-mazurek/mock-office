import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import { INIT } from './actions';
import { startAction } from '../../entities/servers/actions';
import { addAction } from '../../entities/notifications/actions';
import api from '../../resources/api';

const preparePayload = action => ({ id: action.id });
const makeRequest = action => Observable.from(api.startServer({ id: action.id }));
const onFail = result => addAction({ type: 'error', text: result.error });
const onSuccess = result => startAction(result.data.id);
const hasError = has('error');

export default action$ =>
  action$.ofType(INIT)
    .map(preparePayload)
    .flatMap(makeRequest)
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
