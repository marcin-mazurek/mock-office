import unique from 'node-unique';
import Task from 'fun-task';
import deepEqual from 'deep-equal';
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

const createExpectation = (expectation) => {
  let preparationTask;

  switch (expectation.trigger) {
    case 'timeout': {
      preparationTask = Task.create((onSuccess) => {
        setTimeout(() => {
          onSuccess(expectation.response);
        }, expectation.timeout);
      });
      break;
    }
    default: {
      if (expectation.delay) {
        preparationTask = Task.create((onSuccess) => {
          setTimeout(() => {
            onSuccess(expectation.response);
          }, expectation.delay || 0);
        });
      } else {
        preparationTask = Task.of(expectation.response);
      }
    }
  }

  return Object.assign(expectation, {
    id: unique(),
    preparationTask
  });
};

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

const matchExpectation = (queue, requirements) =>
  queue.expectations.findIndex(expectation => deepEqual(expectation.request, requirements));

const tryToFulfillExpectation = (queueId, requirements, taskCallbacks) => {
  const queue = getQueue(queueId);

  const matchExpectationTask = Task.create((onSuccess, onFailure) => {
    const expectationIndex = matchExpectation(queue, requirements);

    if (expectationIndex >= 0) {
      const expectation = queue.expectations.splice(expectationIndex, 1)[0];
      onSuccess(expectation);
      emitRemove(queueId, expectation.id);
    } else {
      onFailure();
    }
  });

  matchExpectationTask.chain(expectation => expectation.preparationTask).run(taskCallbacks);
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
  tryToFulfillExpectation,
  getAll,
  removeExpectation
};
