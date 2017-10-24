import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import { SUBMIT_BUTTON_CLICKED } from '../../components/AddServerForm/actions';
import api from '../../resources/api';
import { succeededAction, failedAction } from './actions';

const preparePayload = (action) => {
  const { values } = action;
  const payload = {
    name: values.get('name'),
    port: parseInt(values.get('port'), 10),
    type: values.get('type'),
    secure: false
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
