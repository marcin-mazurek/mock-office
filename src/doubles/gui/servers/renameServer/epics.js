import { remote } from 'electron';
import { rename } from '../../entities/servers/actions';
import { INIT } from './actions';

export default action$ =>
  action$.ofType(INIT)
    .map((action) => {
      const { id, name } = action;
      remote.require('./main').double.rename(id, name);
      return [id, name];
    }).map(renameConfig => rename(...renameConfig)
  );
