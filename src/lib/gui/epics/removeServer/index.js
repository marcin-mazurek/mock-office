import { ifElse, has } from 'ramda';
import { push } from 'react-router-redux';
import api from '../../resources/api';
import { REMOVE_BUTTON_CLICKED } from '../../components/ServerViewHeader/actions';
import { currentDisplayedServerSelector } from '../../app/sidebar';
import { failedAction, succeededAction } from './actions';

const makeRequest = action => api.removeServer({ id: action.id });
const onFail = result => [failedAction(result.error)];
const onSuccess = store => (result) => {
  const state = store.getState();
  const { data } = result;
  const actions = [];
  const displayedServerId = currentDisplayedServerSelector(state);
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
