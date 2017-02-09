import R from 'ramda';
import Task from 'fun-task';
import unique from 'node-unique';
import HttpServer from './httpServer';
import WSMockServer from './wsServer';
import queues from '../queues';

const serverTypes = {
  http: HttpServer,
  ws: WSMockServer
};

let state = [];

const add = (name, port, type, isSecure, keyPath, certPath) => {
  const id = unique();
  const queueId = queues.addQueue(id);
  const Server = serverTypes[type];

  state = state.concat([
    new Server({ name, port, id, queueId, isSecure, keyPath, certPath })
  ]);

  return { serverId: id, queueId };
};

const start = id => R.compose(
  // transform to promise for redux-saga call mechanism which by default wait for promise fulfill
  task => task.toPromise(),
  server => Task.create((onSuccess) => {
    if (!server.isLive()) {
      server.start(onSuccess);
      return;
    }

    onSuccess();
  }),
  R.find(R.propEq('id', id))
)(state);

const stop = (id) => {
  const serverToStop = state.find(server => server.id === id);

  if (serverToStop.isLive()) {
    return new Promise((resolve) => {
      serverToStop.stop(resolve);
    });
  }

  return Promise.resolve();
};

const get = id => R.find(R.propEq('id', id))(state);
const getAll = () => state;

const addTask = (serverId, task) => {
  const server = state.find(srv => srv.id === serverId);

  return server.addTask(task);
};

export default {
  add,
  start,
  stop,
  get,
  getAll,
  addTask
};
