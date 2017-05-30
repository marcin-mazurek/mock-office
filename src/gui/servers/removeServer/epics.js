import { ifElse, has } from 'ramda';
import { push } from 'react-router-redux';
import api from '../../resources/api';
import { REMOVE_BUTTON_CLICKED } from '../inspectServer/Server';
import currentDisplayedServerSelector from '../../sidebar/selectors';

export const DID_SUCCEED = 'removeServer/DID_SUCCEED';
export const DID_FAIL = 'removeServer/DID_FAIL';
const didSucceedAction = id => ({
  type: DID_SUCCEED,
  id
});
const didFailAction = reason => ({
  type: DID_FAIL,
  reason
});

const makeRequest = action => api.removeServer({ id: action.id });
const onFail = result => [didFailAction(result.error)];
const onSuccess = store => (result) => {
  const state = store.getState();
  const { data } = result;
  const actions = [];
  const displayedServerId = currentDisplayedServerSelector(state);
  if (displayedServerId === data.id) {
    actions.push(push('/'));
  }
  actions.push(didSucceedAction(result.data.id));

  return actions;
};
// const onSuccess = store => (result) => {
//   const state = store.getState();
//   const { data } = result;
//   const actions = [];
//
//   // Change route to prevent errors when trying to display removed server
//   const displayedServerId = getCurrentDisplayedServerId(state);
//   if (displayedServerId === data.id) {
//     actions.push(push('/'));
//   }
//   actions.push(removeServerAction(data.id));
//   const server = selectors.entitySelector(state, data.id);
//   actions.push(removeScenarioAction(server.scenario));
//   const scenario = entitySelector(state, server.scenario);
//   scenario.mocks.forEach(
//     mock => actions.push(removeMockAction(server.scenario, mock))
//   );
//   scenario.mocks
//     .forEach((mockId) => {
//       entitySelector(state, mockId).tasks
//         .forEach(task =>
//           actions.push(removeTaskAction(mockId, task))
//         );
//     });
//   return Observable.from(actions);
// };
const hasError = has('error');

export default (action$, store) =>
  action$.ofType(REMOVE_BUTTON_CLICKED)
    .flatMap(makeRequest)
    .flatMap(
      ifElse(
        hasError,
        onFail,
        onSuccess(store)
      )
    );
