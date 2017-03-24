import { remote } from 'electron';
import { INIT, remove } from './actions';

const removeDescriptionEpic = action$ =>
  action$.ofType(INIT)
    .map((action) => {
      const { serverId, descriptionId } = action;
      const server = remote.require('./main/servers').default.find(serverId);
      server.removeDescription(descriptionId);
      return [serverId, descriptionId];
    }).map(description => remove(...description));

export default removeDescriptionEpic;
