import { ifElse, has } from 'ramda';
import { push } from 'react-router-redux';
import api from '../../resources/api';
import { REMOVE_BUTTON_CLICKED } from '../inspectServer/InspectServer';
import { selectors } from '../../sidebar';

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
  const displayedServerId = selectors.currentDisplayedServerSelector(state);
  if (displayedServerId === data.id) {
    actions.push(push('/'));
  }
  actions.push(didSucceedAction(result.data.id));

  return actions;
};
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
