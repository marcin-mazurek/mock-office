import { ifElse, has } from 'ramda';
import { push } from 'react-router-redux';
import api from '../../resources/api';
import { REMOVE_BUTTON_CLICKED } from '../../components/InspectServer';
import { selectors } from '../../sidebar';

export const SUCCEEDED = 'removeServer/SUCCEEDED';
export const FAILED = 'removeServer/FAILED';
const succeededAction = id => ({
  type: SUCCEEDED,
  id
});
const failedAction = reason => ({
  type: FAILED,
  reason
});

const makeRequest = action => api.removeServer({ id: action.id });
const onFail = result => [failedAction(result.error)];
const onSuccess = store => (result) => {
  const state = store.getState();
  const { data } = result;
  const actions = [];
  const displayedServerId = selectors.currentDisplayedServerSelector(state);
  if (displayedServerId === data.id) {
    actions.push(push('/'));
  }
  actions.push(succeededAction(result.data.id));

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
