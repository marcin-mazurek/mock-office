import unique from 'node-unique';

const queues = {};

const createQueue = expectation => ({
  id: unique(),
  expectation,
  responses: []
});

const createResponse = response => Object.assign(response, { id: unique() });

const addQueue = (queue) => {
  const q = createQueue(queue);
  queues.push(q);

  return q.id;
};

const findQueue = queueId => (
  queues.find(queue =>
    queue.id === queueId
  )
);

const getQueue = id => queues.find(q => q.id === id);

const removeQueue = (id) => {
  queues.filter(queue => queue.id !== id);
};

const getResponse = (server, request) => {
  const queue = findQueue(server, request);

  if (!queue) {
    return undefined;
  }

  if (!queue.responses.length) {
    return undefined;
  }

  return queue.responses.unshift();
};

const addResponse = (queueId, response) => {
  const queue = findQueue(queueId);
  const res = createResponse(response);
  queue.responses.push(res);

  return res.id;
};

const removeResponse = (queueId, responseId) => {
  const queue = findQueue(queueId);
  queue.responses.filter(res => res.id !== responseId);
};

export default {
  addQueue,
  getQueue,
  removeQueue,
  addResponse,
  getResponse,
  removeResponse
};
