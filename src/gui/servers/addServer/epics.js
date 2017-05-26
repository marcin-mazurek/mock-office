import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import { FORM_SUBMITTED, succeedAction, failedAction } from './actions';
import api from '../../resources/api';

const preparePayload = (action) => {
  const { values } = action;
  const payload = {
    name: values.get('name'),
    port: parseInt(values.get('port'), 10),
    type: values.get('type'),
    secure: values.get('secure')
  };

  if (payload.secure === true) {
    payload.keyPath = values.get('keyPath');
    payload.certPath = values.get('certPath');
  }

  return payload;
};
const makeRequest = payload => Observable.from(api.addServer(payload));
const hasError = has('error');
const onSuccess = result => succeedAction(result);
const onFail = result => failedAction(result);

export default action$ =>
  action$.ofType(FORM_SUBMITTED)
    .map(preparePayload)
    .flatMap(makeRequest)
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
