import { Observable } from 'rxjs';
import { has, ifElse } from 'ramda';
import api from '../../resources/api';
import { SUBMIT_SUCCEEDED as HTTP_BEHAVIOUR_FORM_SUBMIT_SUCCEEDED } from '../../components/AddHttpBehaviourForm/actions';
import { SUBMIT_SUCCEEDED as WS_BEHAVIOUR_FORM_SUBMIT_SUCCEEDED } from '../../components/AddWsBehaviourForm/actions';

export const SUCCEED = 'addBehaviour/SUCCEEDED';
export const succeedAction = (serverId, behaviour) => ({
  type: SUCCEED,
  serverId,
  behaviour
});
export const FAILED = 'addBehaviour/FAILED';
export const failedAction = reason => ({
  type: FAILED,
  reason
});

const makeRequest = action =>
  Observable.from(
    api.addBehaviour(
      action.serverId,
      action.values
    )
    .then(behaviour => ({
      behaviour,
      serverId: action.serverId
    }))
    .catch(error => ({ error: error.message }))
  );
const hasError = has('error');
const onSuccess = ({ behaviour, serverId }) => succeedAction(serverId, behaviour);
const onFail = ({ error }) => failedAction(error);

export default function addBehaviourEpic(action$) {
  return action$.ofType(
    HTTP_BEHAVIOUR_FORM_SUBMIT_SUCCEEDED,
    WS_BEHAVIOUR_FORM_SUBMIT_SUCCEEDED
  )
    .flatMap(makeRequest)
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
}
