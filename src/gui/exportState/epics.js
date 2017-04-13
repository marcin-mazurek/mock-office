import { INIT } from './actions';

export default action$ =>
  action$.ofType(INIT)
    .map(() => {
      window.location = 'http://127.0.0.1:3060/export';
      return true;
    })
    .mapTo({ type: 'SAVE_STATE_COMPLETE' });
