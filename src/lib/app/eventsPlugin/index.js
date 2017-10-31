import http from 'http';
import { Server as WebSocketServer } from 'ws';
import colors from 'colors/safe';

const GUI_EVENTS_SERVER_PORT = 3061;

export function configureGuiEventsServer(serversManager) {
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

  serversManager.on('mock-expire', args => broadcast('MOCK_EXPIRE', args));
  serversManager.on('mock-start', args => broadcast('MOCK_START', args));
  serversManager.on('mock-end', args => broadcast('MOCK_END', args));
  serversManager.on('mock-cancel', args => broadcast('MOCK_CANCEL', args));

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
  start(serversManager) {
    const guiEventsServer = configureGuiEventsServer(serversManager);
    serveGuiEventsServer(guiEventsServer.server, GUI_EVENTS_SERVER_PORT);
  }
};