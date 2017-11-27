import { Observable } from 'rxjs';
import api from '../../resources/api';
import { SUBMIT_SUCCEEDED as HTTP_BEHAVIOUR_FORM_SUBMIT_SUCCEEDED } from '../../components/AddHttpBehaviourForm/actions';
import { SUBMIT_SUCCEEDED as WS_BEHAVIOUR_FORM_SUBMIT_SUCCEEDED } from '../../components/AddWsBehaviourForm/actions';
import { paramsSelector } from '../../app/addBehaviour/selectors';
import { ConnectionError } from '../../resources/api/errors';

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

export default function addBehaviourEpic(action$, store) {
  return action$.ofType(HTTP_BEHAVIOUR_FORM_SUBMIT_SUCCEEDED, WS_BEHAVIOUR_FORM_SUBMIT_SUCCEEDED)
    .flatMap((action) => {
      const params = paramsSelector(store.getState());
      return Observable.from(
        api.addBehaviour(
          params.get('serverId'),
          action.values
        )
        .then(behaviour => ({
          behaviour,
          serverId: params.get('serverId')
        }))
      );
    })
    .map(({ behaviour, serverId }) => succeedAction(serverId, behaviour))
    .catch((error) => {
      if (error instanceof ConnectionError) {
        return failedAction(error);
      }

      throw new Error(error.message);
    });
}
