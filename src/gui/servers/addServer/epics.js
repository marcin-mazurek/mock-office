import { Observable } from 'rxjs';
import { ifElse, has } from 'ramda';
import { addAction } from '../../entities/servers/actions';
import { FORM_SUBMITTED } from './actions';
import api from '../../resources/api';
import { addAction as addNotification } from '../../entities/notifications/actions';
import { closeAction as closeModalAction } from '../../modals/actions';
import { addAction as addScenario } from '../../entities/scenarios/actions';

const preparePayload = (action) => {
  const { values } = action;
  const payload = {
    name: values.get('name'),
    port: parseInt(values.get('port'), 10),
    type: values.get('type'),
    isSecure: values.get('isSecure')
  };

  if (payload.isSecure === true) {
    payload.keyPath = values.get('keyPath');
    payload.certPath = values.get('certPath');
  }

  return payload;
};
const makeRequest = payload => Observable.from(api.addServer(payload));
const hasError = has('error');
const onFail = result => [addNotification({ type: 'error', text: result.error })];
const onSuccess = result => [
  addNotification({ type: 'success', text: 'Server added' }),
  closeModalAction(),
  addScenario(result.data.id, result.data.id),
  addAction(result.data.id, {
    name: result.data.name,
    port: result.data.port,
    type: result.data.type,
    id: result.data.id,
    isSecure: result.data.isSecure,
    scenario: result.data.id
  })
];

export default action$ =>
  action$.ofType(FORM_SUBMITTED)
    .map(preparePayload)
    .flatMap(makeRequest)
    .flatMap(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
