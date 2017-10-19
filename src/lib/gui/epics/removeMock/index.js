import { ifElse, has } from 'ramda';
import api from '../../resources/api/index';
import { REMOVE_BUTTON_CLICKED as HTTP_REMOVE_BUTTON_CLICKED } from '../../components/HttpMockListItem';
import { REMOVE_BUTTON_CLICKED as WS_REMOVE_BUTTON_CLICKED } from '../../components/WsMockListItem';

export const DID_SUCCEED = 'removeMock/SUCCEEDED';
const didSucceedAction = (scenario, id) => ({
  type: DID_SUCCEED,
  scenario,
  id
});
export const DID_FAIL = 'removeMock/DID_FAIL';
const didFailAction = reason => ({
  type: DID_FAIL,
  reason
});

const makeRequest = action => api.removeMock({
  mockId: action.mockId,
  serverId: action.serverId,
  scenarioId: action.scenarioId
});
const hasError = has('error');
const onSuccess = result => didSucceedAction(result.scenarioId, result.mockId);
const onFail = result => didFailAction(result.error);

export const removeMockEpic = action$ =>
  action$.ofType(HTTP_REMOVE_BUTTON_CLICKED, WS_REMOVE_BUTTON_CLICKED)
    .flatMap(makeRequest)
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
