import express from 'express';
import path from 'path';
import colors from 'colors/safe';
import http from 'http';
import { Server as WebSocketServer } from 'ws';
import { on } from '../eventLog';
import serversHub from '../serversHub';

const GUI_EVENTS_SERVER_PORT = 3061;

export function configureGuiEventsServer() {
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
  on('behaviour-status-change', args => broadcast('behaviour-status-change', args));
  on('reaction-status-change', args => broadcast('reaction-status-change', args));

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

export function createGuiServer() {
  const staticAssetsMiddleware = (req, res) => {
    res.sendFile(path.resolve(__dirname, `../../gui/${req.originalUrl}`));
  };
  const reactAppMiddleware = (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../gui/index.html'));
  };
  const app = express();
  app.use('/static/*', staticAssetsMiddleware);
  app.use('*', reactAppMiddleware);
  return app;
}

export function serveGuiServer(port) {
  createGuiServer().listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(colors.green(`GUI address: http://127.0.0.1:${port}`));
  });
  const guiEventsServer = configureGuiEventsServer(serversHub);
  serveGuiEventsServer(guiEventsServer.server, GUI_EVENTS_SERVER_PORT);
}
