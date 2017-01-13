import { ipcMain } from 'electron';
import { Script } from 'vm';
import { ADD_SCRIPT } from '../../common/messageNames';
import servers from '../servers';

export default {
  init() {
    ipcMain.on(ADD_SCRIPT, (event, args) => {
      const server = servers.get(args.serverId);
      const customScript = new Script(args.script);

      if (!server.listening) {
        server.start(() => {
          customScript.runInNewContext({ server: server.instance });
        });
      } else {
        customScript.runInNewContext({ server: server.instance });
      }
    });
  }
};
