import { Server as WebSocketServer } from 'ws';
import queues from '../../queues';

export default class WSMockServer {
  constructor(config) {
    this.type = 'ws';
    this.port = config.port || 3010;
    this.name = config.name;
    this.id = config.id;
    this.listening = false;
  }

  respond() {
    this.instance.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err.message);
    });

    this.instance.on('connection', (ws) => {
      this.ws = ws;

      this.startReadingMessages();
    });
  }

  start(cb) {
    this.instance = new WebSocketServer({ port: this.port }, () => {
      this.listening = true;
      this.respond();
      cb();
    });
  }

  startReadingMessages() {
    this.ws.on('message', (message) => {
      const response = queues.getResponse(message);

      if (response) {
        this.ws.send(response);
      } else {
        this.ws.send('Unknown message');
      }
    });
  }

  stop(cb) {
    this.instance.close(() => {
      this.listening = false;
      cb();
    });
  }

  isLive() {
    return this.listening;
  }
}
