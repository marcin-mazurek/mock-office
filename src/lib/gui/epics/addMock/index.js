import { Observable } from 'rxjs';
import api from '../../resources/api';
import { SUBMIT_SUCCEEDED } from '../../components/AddHttpMockForm/actions';
import { paramsSelector } from '../../app/addMock/selectors';
import { ConnectionError } from '../../resources/api/errors';

export const SUCCEED = 'addMock/SUCCEEDED';
export const succeedAction = (scenario, mock) => ({
  type: SUCCEED,
  scenario,
  mock
});
export const FAILED = 'addMock/FAILED';
export const failedAction = reason => ({
  type: FAILED,
  reason
});

export default function addMockEpic(action$, store) {
  let mockId;

  return action$.ofType(SUBMIT_SUCCEEDED)
    .flatMap((action) => {
      const params = paramsSelector(store.getState());
      return Observable.from(
        api.addMock(
          params.get('server'),
          params.get('scenario'),
          action.values
        )
      );
    })
    .flatMap((id) => {
      mockId = id;
      const params = paramsSelector(store.getState());
      return Observable.fromPromise(api.getMock(params.get('server'), params.get('scenario'), id));
    })
    .map((mock) => {
      const params = paramsSelector(store.getState());
      return succeedAction(params.get('scenario'), Object.assign({ id: mockId }, mock));
    })
    .catch((error) => {
      if (error instanceof ConnectionError) {
        return failedAction(error);
      }

      throw new Error(error.message);
    });
}
