import http from 'http';
import { Server as WebSocketServer } from 'ws';
import colors from 'colors/safe';
import { addListener } from './servers-manager/emitter';

export function configureGuiEventsServer(serversManager, persistentState) {
  const httpServer = http.createServer();
  const server = new WebSocketServer({ server: httpServer });
  const sockets = [];

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
  });

  addListener('SCENE_REMOVED',
    args => broadcast('SCENE_REMOVED', args)
  );

  addListener('SCENE_START',
    args => broadcast('SCENE_START', args)
  );

  addListener('SCENE_END',
    args => broadcast('SCENE_END', args)
  );

  addListener('SCENE_CANCEL',
    args => broadcast('SCENE_CANCEL', args)
  );

  addListener('SCENE_REMOVED_AFTER_USE',
    args => broadcast('SCENE_REMOVED_AFTER_USE', args)
  );

  addListener('SCENE_PART_START',
    args => broadcast('SCENE_PART_START', args)
  );

  addListener('SCENE_PART_END',
    args => broadcast('SCENE_PART_END', args)
  );

  addListener('SCENE_PART_CANCEL',
    args => broadcast('SCENE_PART_CANCEL', args)
  );

  return httpServer;
}

export function serveGuiEventsServer(server, port) {
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(colors.green(`GUI events address: ws://127.0.0.1:${port}`));
  });
}
