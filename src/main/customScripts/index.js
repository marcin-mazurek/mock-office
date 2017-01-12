import { ipcMain } from 'electron';
import { ADD_SCRIPT } from '../../common/messageNames';
import servers from '../servers';

export default {
  init() {
    ipcMain.on(ADD_SCRIPT, (event, args) => {
      const server = servers.get(args.serverId);

      if (!server.listening) {
        server.start(() => {
          const customBehaviour = eval(args.script);
          customBehaviour(server.instance);
        });
      } else {
        const customBehaviour = eval(args.script);
        customBehaviour(server.instance);
      }
    });
  }
};
