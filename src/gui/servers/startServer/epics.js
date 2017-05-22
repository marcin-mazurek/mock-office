import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import { INIT } from './actions';
import { start } from '../../entities/servers/actions';
import { add } from '../../entities/notifications/actions';
import api from '../../api';

const preparePayload = action => ({ id: action.id });
const makeRequest = action => Observable.from(api.startServer({ id: action.id }));
const onFail = result => add({ type: 'error', text: result.error });
const onSuccess = result => start(result.data.id);
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
