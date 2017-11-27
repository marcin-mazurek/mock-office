import { ifElse, has } from 'ramda';
import api from '../../resources/api';
import { REMOVE_BUTTON_CLICKED as HTTP_REMOVE_BUTTON_CLICKED } from '../../components/HttpBehaviourListItem';
import { REMOVE_BUTTON_CLICKED as WS_REMOVE_BUTTON_CLICKED } from '../../components/WsBehaviourListItem';

export const DID_SUCCEED = 'removeBehaviour/SUCCEEDED';
const didSucceedAction = (serverId, behaviourId) => ({
  type: DID_SUCCEED,
  serverId,
  behaviourId
});
export const DID_FAIL = 'removeBehaviour/DID_FAIL';
const didFailAction = reason => ({
  type: DID_FAIL,
  reason
});

const makeRequest = action => api.removeBehaviour({
  behaviourId: action.behaviourId,
  serverId: action.serverId
})
  .then(() => ({
    behaviourId: action.behaviourId,
    serverId: action.serverId
  }))
  .catch(error => ({
    error
  }));
const hasError = has('error');
const onSuccess = result => didSucceedAction(result.serverId, result.behaviourId);
const onFail = result => didFailAction(result.error);

export const removeBehaviourEpic = action$ =>
  action$.ofType(HTTP_REMOVE_BUTTON_CLICKED, WS_REMOVE_BUTTON_CLICKED)
    .flatMap(makeRequest)
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
