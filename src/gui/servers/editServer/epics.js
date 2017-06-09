import { Observable } from 'rxjs';
import { has, ifElse } from 'ramda';
import { FORM_DID_SUBMIT } from './EditServerForm';
import api from '../../resources/api';

export const DID_SUCCEED = 'editServer/DID_SUCCEED';
export const DID_FAIL = 'editServer/DID_FAIL';
const didFailAction = reason => ({
  type: DID_FAIL,
  reason
});
const didSucceedAction = result => ({
  type: DID_SUCCEED,
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
  return action$.ofType(FORM_DID_SUBMIT)
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
