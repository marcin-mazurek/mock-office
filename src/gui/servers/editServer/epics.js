import { Observable } from 'rxjs';
import { has, ifElse } from 'ramda';
import { FORM_SUBMITTED } from './EditServerForm';
import api from '../../resources/api';

export const SUCCEEDED = 'editServer/SUCCEEDED';
export const FAILED = 'editServer/FAILED';
const didFailAction = reason => ({
  type: FAILED,
  reason
});
const didSucceedAction = result => ({
  type: SUCCEEDED,
  result
});

const preparePayload = action => ({
  id: action.id,
  name: action.values.get('name'),
  port: parseInt(action.values.get('port'), 10)
});
const makeRequest = payload => Observable.from(api.editServer(payload));
const hasError = has('error');
const onFail = result => didFailAction(result.error);
const onSuccess = result => didSucceedAction(result.data);

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
