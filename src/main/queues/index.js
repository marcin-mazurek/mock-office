import unique from 'node-unique';
import deepEqual from 'deep-equal';

const queues = [];

const createQueue = (server, request) => ({
  id: unique(),
  request,
  server,
  responses: []
});

const createResponse = response => Object.assign(response, { id: unique() });

const addQueue = (server, request) => {
  const q = createQueue(server, request);
  queues.push(q);

  return q.id;
};

const getQueue = id => queues.find(q => q.id === id);
const removeQueue = (id) => {
  queues.filter(queue => queue.id !== id);
};

const findQueueByRequest = (server, request) =>
  queues.find(q => q.server === server && deepEqual(request.url, q.request.url));

const getResponse = (server, request) => {
  const queue = findQueueByRequest(server, request);

  if (!queue) {
    return undefined;
  }

  if (!queue.responses.length) {
    return undefined;
  }

  return queue.responses.shift();
};

const addResponse = (queueId, response) => {
  const queue = getQueue(queueId);
  const res = createResponse(response);
  queue.responses.push(res);

  return res.id;
};

const removeResponse = (queueId, responseId) => {
  const queue = getQueue(queueId);
  queue.responses.filter(res => res.id !== responseId);
};

export default {
  findQueueByRequest,
  addQueue,
  getQueue,
  removeQueue,
  addResponse,
  getResponse,
  removeResponse
};
