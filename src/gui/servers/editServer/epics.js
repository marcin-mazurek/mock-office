import { Observable } from 'rxjs';
import { has, ifElse } from 'ramda';
import { INITIALIZED } from './actions';
import { updateAction } from '../../entities/servers/actions';
import { addAction } from '../../entities/notifications/actions';
import api from '../../resources/api';

const preparePayload = action => ({
  id: action.id,
  name: action.values.get('name'),
  port: parseInt(action.values.get('port'), 10)
});
const makeRequest = payload => Observable.from(api.editServer(payload));
const hasError = has('error');
const onFail = result => [addAction({ type: 'error', text: result.error })];
const onSuccess = (result) => {
  const { data } = result;
  return [updateAction(data.id, data)];
};

export default function editServerEpic(action$) {
  return action$.ofType(INITIALIZED)
    .map(preparePayload)
    .flatMap(makeRequest)
    .flatMap(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
}
