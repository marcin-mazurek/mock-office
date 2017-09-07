import { Observable } from 'rxjs';
import { has, ifElse } from 'ramda';
import { FORM_SUBMITTED } from '../../components/EditServerForm/actions';
import api from '../../resources/api';
import { failedAction, succeededAction } from './actions';

const preparePayload = action => ({
  id: action.id,
  name: action.values.get('name'),
  port: parseInt(action.values.get('port'), 10)
});
const makeRequest = payload => Observable.from(api.editServer(payload));
const hasError = has('error');
const onFail = result => failedAction(result.error);
const onSuccess = result => succeededAction(result.data);

export default function editServerEpic(action$) {
  return action$.ofType(FORM_SUBMITTED)
    .map(preparePayload)
    .flatMap(makeRequest)
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
}
