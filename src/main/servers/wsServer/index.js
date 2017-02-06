import { Server as WebSocketServer } from 'ws';
import R from 'ramda';
import https from 'https';
import fs from 'fs';
import path from 'path';
import queues from '../../queues';

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../keys/localhost.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../keys/localhost.cert'))
};

const respond = R.curry((queueId, ws, message) => {
  console.log(message);
  queues.tryRun(queueId, { message }, exp => ws.send(exp.message), R.identity);
});

export default class WSMockServer {
  constructor(config) {
    this.type = 'ws';
    this.port = config.port || 3010;
    this.name = config.name;
    this.id = config.id;
    this.listening = false;
    this.queueId = config.queueId;
  }

  start(cb) {
    const app = https.createServer(options, (req, res) => res.send('Hello world')).listen(this.port);
    this.instance = new WebSocketServer(
      {
        server: app
      }
    );

    console.log('wss created');
    this.listening = true;
    this.instance.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err.message);
    });

    this.instance.on('connection', (ws) => {
      console.log('connected');
      this.ws = ws;

      this.ws.ping();

      this.ws.on('message', respond(this.queueId, this.ws));
    });
    cb();
  }

  stop(cb) {
    this.instance.close(() => {
      this.listening = false;
      cb();
    });
  }

  addExpectation(expectation, shouldRunImmediately) {
    const expectationId = queues.addExpectation(this.queueId, expectation);

    if (shouldRunImmediately && this.isLive()) {
      queues.run(this.queueId, expectationId, exp => this.ws.send(exp.message));
    }

    return expectationId;
  }

  isLive() {
    return this.listening;
  }
}
