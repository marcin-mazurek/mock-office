import { Observable } from 'rxjs';
import { has, ifElse } from 'ramda';
import api from '../../resources/api/index';
import {
  failedAction,
  succeededAction
} from './actions';

const hasError = has('error');
const onSuccess = result => succeededAction(result.data.id);
const onFail = result => failedAction(result.error);

export default action$ =>
  action$
    .flatMap(action => Observable.from(api.stopServer({ id: action.id })))
    .map(
      ifElse(
        hasError,
        onFail,
        onSuccess
      )
    );
