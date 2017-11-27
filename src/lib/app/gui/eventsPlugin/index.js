import http from 'http';
import { Server as WebSocketServer } from 'ws';
import colors from 'colors/safe';

const GUI_EVENTS_SERVER_PORT = 3061;

export function configureGuiEventsServer(on) {
  const httpServer = http.createServer();
  const server = new WebSocketServer({ server: httpServer });
  let sockets = [];

  function broadcast(event, args) {
    sockets.forEach(
      socket => socket.send(JSON.stringify(Object.assign({ event }, args)))
    );
  }

  server.on('connection', (ws) => {
    sockets.push(ws);

    ws.on('close', () => {
      sockets = sockets.filter(socket => socket !== ws);
    });
  });
  on('server-reactions-start', args => broadcast('SERVER_REACTIONS_STARTED', args));
  on('server-reactions-end', args => broadcast('SERVER_REACTIONS_ENDED', args));
  on('server-reactions-cancel', args => broadcast('SERVER_REACTIONS_CANCELLED', args));

  return {
    server: httpServer,
    broadcast
  };
}

export function serveGuiEventsServer(server, port) {
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(colors.green(`GUI events address: ws://127.0.0.1:${port}`));
  });
}

export default {
  start(serversHub) {
    const guiEventsServer = configureGuiEventsServer(serversHub);
    serveGuiEventsServer(guiEventsServer.server, GUI_EVENTS_SERVER_PORT);
  }
};
