import unique from 'node-unique';
import deepEqual from 'deep-equal';
import { REMOVE_RESPONSE_AFTER_USE } from '../../common/messageNames';

const queues = [];

let mainWin;

const init = (mW) => {
  mainWin = mW;
};

const emitRemove = (queueId, responseId) => {
  mainWin.webContents.send(REMOVE_RESPONSE_AFTER_USE, { queueId, responseId });
};

const createQueue = (server, request) => ({
  id: unique(),
  request,
  server,
  responses: []
});

const createResponse = (response) => Object.assign(response, { id: unique() });

const addQueue = (server, request) => {
  const q = createQueue(server, request);
  queues.push(q);

  return q.id;
};

const getQueue = id => queues.find(q => q.id === id);
const removeQueue = (id) => {
  queues.filter(queue => queue.id !== id);
};

const findQueue = (server, request) =>
  queues.find(q => q.server === server && deepEqual(request, q.request));

const prepareResponse = (server, request) => {
  const queue = findQueue(server, request);

  if (!queue || !queue.responses.length) {
    return Promise.reject();
  }

  const response = queue.responses.shift();
  emitRemove(queue.id, response.id);

  return Promise.resolve(response);
};

const addResponse = (queueId, response) => {
  const queue = getQueue(queueId);
  const res = createResponse(response);
  queue.responses.push(res);

  return res.id;
};

const removeResponse = (queueId, responseId) => {
  const queue = getQueue(queueId);
  const queueIndex = queue.responses.findIndex(res => res.id === responseId);
  queue.responses.splice(queueIndex, 1);
};

const getAll = () => queues;

export default {
  init,
  findQueue,
  addQueue,
  getQueue,
  removeQueue,
  addResponse,
  prepareResponse,
  getAll,
  removeResponse
};
