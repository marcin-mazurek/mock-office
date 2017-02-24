import { Script } from 'vm';
import servers from '../servers';

export default (serverId, script) => {
  const server = servers.find(serverId);
  const customScript = new Script(script);

  if (!server.listening) {
    server.start(() => {
      customScript.runInNewContext({ server: server.instance });
    });
  } else {
    customScript.runInNewContext({ server: server.instance });
  }
};
