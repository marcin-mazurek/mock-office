import { START } from '../../actions';
import { succeededAction } from './actions';
import api from '../../resources/api';

export default action$ =>
  action$.ofType(START)
    .flatMap(api.getState)
    .map(succeededAction);
