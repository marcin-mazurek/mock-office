import { Server as WebSocketServer } from 'ws';
import { addListener } from './servers-manager/emitter';

export default function createGuiEventsServer(serversManager, persistentState) {
  const sockets = [];
  let server;

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

  function start(port) {
    server = new WebSocketServer({ port });
    server.on('connection', autoHydrateClientState);
    server.on('connection', watchSaveState);

    server.on('connection', (ws) => {
      sockets.push(ws);
    });

    addListener('SCENE_REMOVED',
      args => server.broadcast('SCENE_REMOVED', args)
    );

    addListener('SCENE_START',
      args => server.broadcast('SCENE_START', args)
    );

    addListener('SCENE_END',
      args => server.broadcast('SCENE_END', args)
    );

    addListener('SCENE_CANCEL',
      args => server.broadcast('SCENE_CANCEL', args)
    );

    addListener('SCENE_REMOVED_AFTER_USE',
      args => server.broadcast('SCENE_REMOVED_AFTER_USE', args)
    );

    addListener('SCENE_PART_START',
      args => server.broadcast('SCENE_PART_START', args)
    );

    addListener('SCENE_PART_END',
      args => server.broadcast('SCENE_PART_END', args)
    );

    addListener('SCENE_PART_CANCEL',
      args => server.broadcast('SCENE_PART_CANCEL', args)
    );
  }

  return {
    start,
    broadcast
  };
}
