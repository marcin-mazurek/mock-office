import http from 'http';
import { Server as WebSocketServer } from 'ws';
import colors from 'colors/safe';
import { serversManager } from '../serversManager';

export function configureGuiEventsServer(persistentState) {
  const httpServer = http.createServer();
  const server = new WebSocketServer({ server: httpServer });
  let sockets = [];

  function broadcast(event, args) {
    sockets.forEach(
      socket => socket.send(JSON.stringify(Object.assign({ event }, args)))
    );
  }

  function autoHydrateClientState(ws) {
    ws.send(
      JSON.stringify(
        Object.assign(
          { event: 'RESTORE_STATE' },
          { state: serversManager.getState() }
        )
      )
    );
  }

  function watchSaveState(ws) {
    ws.on('message', (message) => {
      if (message === 'SAVE_STATE') {
        persistentState.save();
      }
    });
  }

  server.on('connection', autoHydrateClientState);
  server.on('connection', watchSaveState);

  server.on('connection', (ws) => {
    sockets.push(ws);

    ws.on('close', () => {
      sockets = sockets.filter(socket => socket !== ws);
    });
  });

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
