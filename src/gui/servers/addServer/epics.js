import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import { add } from '../../entities/servers/actions';
import { SUBMIT } from './actions';
import requestAddServer from './rest';
import { add as addNotification } from '../../entities/notifications/actions';
import { closeAction as closeModalAction } from '../../modals/actions';

const preparePayload = (action) => {
  const payload = {
    name: action.values.name,
    port: parseInt(action.values.port, 10),
    type: action.values.type,
    isSecure: action.values.isSecure
  };

  if (payload.isSecure === true) {
    payload.keyPath = action.values.keyPath;
    payload.certPath = action.values.certPath;
  }

  return payload;
};

const makeRequest = payload => Observable.from(requestAddServer(payload));

const fail = result => [addNotification({ type: 'error', text: result.error })];
const success = result => [
  addNotification({ type: 'success', text: 'Server added' }),
  closeModalAction(),
  add(result.data.name, result.data.port, result.data.type, result.data.id, result.data.isSecure)
];

const hasError = has('error');

export default action$ =>
  action$.ofType(SUBMIT)
    .map(preparePayload)
    .flatMap(makeRequest)
    .flatMap(
      ifElse(
        hasError,
        fail,
        success
      )
    );
