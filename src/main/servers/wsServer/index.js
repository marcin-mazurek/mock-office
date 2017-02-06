import { Server as WebSocketServer } from 'ws';
import queues from '../../queues';

export default class WSMockServer {
  constructor(config) {
    this.type = 'ws';
    this.port = config.port || 3010;
    this.name = config.name;
    this.id = config.id;
    this.listening = false;
    this.queueId = config.queueId;
  }

  respond() {
    this.instance.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err.message);
    });

    this.instance.on('connection', (ws) => {
      this.ws = ws;

      this.ws.on('message', (message) => {
        queues.findAndRunTask(this.queueId, { message }, {
          success: expectation => this.ws.send(expectation.message),
          failure: () => this.ws.send('Unknown message')
        });
      });
    });
  }

  start(cb) {
    this.instance = new WebSocketServer({ port: this.port }, () => {
      this.listening = true;
      this.respond();
      cb();
    });
  }

  stop(cb) {
    this.instance.close(() => {
      this.listening = false;
      cb();
    });
  }

  addExpectation(expectation) {
    const expectationId = queues.addExpectation(this.queueId, expectation);

    if (expectation.instant) {
      queues.runTask(this.queueId, expectationId, {
        success: exp => this.ws.send(exp.message),
      });
    }

    return expectationId;
  }

  isLive() {
    return this.listening;
  }
}
