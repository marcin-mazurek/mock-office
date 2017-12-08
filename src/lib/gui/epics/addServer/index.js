import { Observable } from 'rxjs';
import { SUBMIT_BUTTON_CLICKED } from '../../components/AddServerForm/actions';
import mockOfficeService from '../../resources/mockOfficeService';
import { succeededAction, failedAction } from './actions';

const preparePayload = (action) => {
  const { values } = action;
  const payload = {
    name: values.get('name'),
    port: parseInt(values.get('port'), 10),
    type: values.get('type'),
    fallbackUrl: values.get('fallbackUrl'),
    secure: false
  };

  if (payload.secure === true) {
    payload.keyPath = values.get('keyPath');
    payload.certPath = values.get('certPath');
  }

  return payload;
};
const onSuccess = payload => succeededAction(payload);
const onFail = message => failedAction(message);
const makeRequest = payload =>
  Observable.from(mockOfficeService.addServer(payload))
    .map(onSuccess)
    .catch(e => Observable.of(onFail(e.message)));

export default action$ =>
  action$.ofType(SUBMIT_BUTTON_CLICKED)
    .map(preparePayload)
    .flatMap(makeRequest);
