import { Observable } from 'rxjs';
import { FORM_SUBMITTED } from '../../components/EditServerForm/actions';
import mockOfficeService from '../../resources/mockOfficeService';
import { failedAction, succeededAction } from './actions';

const makeRequest = action =>
  Observable.from(mockOfficeService.editServer(action.id, action.values))
    .map(payload => succeededAction(payload))
    .catch(e => Observable.from(failedAction(e.message)));

export default function editServerEpic(action$) {
  return action$.ofType(FORM_SUBMITTED)
    .flatMap(makeRequest);
}
