import unique from 'node-unique';
import { REMOVE_RESPONSE_AFTER_USE } from '../../common/messageNames';

const queues = [];

let mainWin;

const init = (mW) => {
  mainWin = mW;
};

const emitRemove = (queueId, responseId) => {
  mainWin.webContents.send(REMOVE_RESPONSE_AFTER_USE, { queueId, responseId });
};

const createQueue = serverId => ({
  id: unique(),
  serverId,
  responses: []
});

const createResponse = response => Object.assign(response, { id: unique() });

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

const prepareResponse = (server) => {
  const queueId = getServerQueueId(server);
  const queue = getQueue(getServerQueueId(server));

  if (!queue || !queue.responses.length) {
    return Promise.reject();
  }

  const response = queue.responses.shift();
  emitRemove(queueId, response.id);

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
  getServerQueueId,
  addQueue,
  getQueue,
  removeQueue,
  addResponse,
  prepareResponse,
  getAll,
  removeResponse
};
