import http from 'http';
import { Server as WebSocketServer } from 'ws';
import colors from 'colors/safe';
import { addListener } from './serversManager/emitter';

export function configureGuiEventsServer(serversManager, persistentState) {
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

  addListener('MOCK_REMOVED',
    args => broadcast('MOCK_REMOVED', args)
  );

  addListener('MOCK_START',
    args => broadcast('MOCK_START', args)
  );

  addListener('MOCK_END',
    args => broadcast('MOCK_END', args)
  );

  addListener('MOCK_CANCEL',
    args => broadcast('MOCK_CANCEL', args)
  );

  addListener('MOCK_REMOVED_AFTER_USE',
    args => broadcast('MOCK_REMOVED_AFTER_USE', args)
  );

  addListener('MOCK_PART_START',
    args => broadcast('MOCK_PART_START', args)
  );

  addListener('MOCK_PART_END',
    args => broadcast('MOCK_PART_END', args)
  );

  addListener('MOCK_PART_CANCEL',
    args => broadcast('MOCK_PART_CANCEL', args)
  );

  return httpServer;
}

export function serveGuiEventsServer(server, port) {
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(colors.green(`GUI events address: ws://127.0.0.1:${port}`));
  });
}
