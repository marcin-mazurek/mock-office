import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import { INITIALIZED } from './actions';
import { actionCreators } from '../../entities/module';
import { addAction } from '../../notifications/actions';
import api from '../../resources/api';

const preparePayload = action => ({ id: action.id });
const makeRequest = action => Observable.from(api.startServer({ id: action.id }));
const onFail = result => addAction({ type: 'error', text: result.error });
const onSuccess = result => actionCreators.startServerAction(result.data.id);
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
