import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import { SUBMIT_BUTTON_CLICKED } from './AddServerForm';
import api from '../../resources/api';

export const SUCCEEDED = 'addServer/SUCCEED';
export const FAILED = 'addServer/FAILED';

export const succeededAction = params => ({
  type: SUCCEEDED,
  params
});

export const failedAction = reason => ({
  type: FAILED,
  reason
});

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
const onSuccess = result => succeededAction(result);
const onFail = result => failedAction(result.error);

export default action$ =>
  action$.ofType(SUBMIT_BUTTON_CLICKED)
    .map(preparePayload)
    .flatMap(makeRequest)
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
