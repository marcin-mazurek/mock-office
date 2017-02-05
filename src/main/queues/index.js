import unique from 'node-unique';
import { REMOVE_RESPONSE_AFTER_USE } from '../common/messageNames';

const queues = [];

let mainWin;

const init = (mW) => {
  mainWin = mW;
};

const emitRemove = (queueId, expectationId) => {
  mainWin.webContents.send(REMOVE_RESPONSE_AFTER_USE, { queueId, expectationId });
};

const createQueue = serverId => ({
  id: unique(),
  serverId,
  expectations: []
});

const createExpectation = expectation => Object.assign(expectation, { id: unique() });

const addQueue = (serverId) => {
  const q = createQueue(serverId);
  queues.push(q);

  return q.id;
};

const getQueue = id => queues.find(q => q.id === id);
const removeQueue = (serverId) => {
  queues.filter(queue => queue.serverId !== serverId);
};

const getServerQueueId = serverId =>
  queues.find(q => q.serverId === serverId).id;

const prepareExpectation = (server) => {
  const queueId = getServerQueueId(server);
  const queue = getQueue(getServerQueueId(server));

  if (!queue || !queue.expectations.length) {
    return Promise.reject();
  }

  const expectation = queue.expectations.shift();
  emitRemove(queueId, expectation.id);

  return Promise.resolve(expectation);
};

const addExpectation = (queueId, expectation) => {
  const queue = getQueue(queueId);
  const res = createExpectation(expectation);
  queue.expectations.push(res);

  return res.id;
};

const removeExpectation = (queueId, expectationId) => {
  const queue = getQueue(queueId);
  const queueIndex = queue.expectations.findIndex(res => res.id === expectationId);
  queue.expectations.splice(queueIndex, 1);
};

const getAll = () => queues;

export default {
  init,
  getServerQueueId,
  addQueue,
  getQueue,
  removeQueue,
  addExpectation,
  prepareExpectation,
  getAll,
  removeExpectation
};
