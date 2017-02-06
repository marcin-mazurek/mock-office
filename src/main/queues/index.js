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
  tasks: []
});

const createExpectation = (task) => {
  let prepare;
  let run;

  if (task.delay) {
    prepare = Task.create((onSuccess) => {
      setTimeout(() => {
        onSuccess(task.taskPayload);
      }, task.delay || 0);
    });
  } else {
    prepare = Task.of(task.taskPayload);
  }

  if (task.interval) {
    run = (successCb) => {
      setInterval(() => {
        let intervalPrepare;

        if (task.delay) {
          intervalPrepare = Task.create((onSuccess) => {
            setTimeout(() => {
              onSuccess(task.taskPayload);
            }, task.delay || 0);
          });
        } else {
          intervalPrepare = Task.of(task.taskPayload);
        }

        intervalPrepare.run({ success: successCb });
      }, task.interval);
    };
  } else {
    run = successCb => prepare.run({ success: successCb });
  }

  return Object.assign(task, {
    interval: task.interval,
    id: unique(),
    run
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

const run = (queueId, taskId, successCb) => {
  const queue = queues.find(q => q.id === queueId);
  const taskIndex = queue.tasks.findIndex(exp => exp.id === taskId);
  const task = queue.tasks[taskIndex];

  if (!task.interval) {
    queue.tasks.splice(taskIndex, 1);
    emitRemove(queueId, taskId);
  }

  task.run(successCb);
};

const tryRun = (queueId, requirements, successCb, failureCb) => {
  const queue = getQueue(queueId);
  const taskIndex = queue.tasks.findIndex(task => deepEqual(task.requirements, requirements));
  const task = queue.tasks[taskIndex];

  if (taskIndex >= 0) {
    run(queueId, task.id, successCb);
  } else {
    failureCb();
  }
};

const addExpectation = (queueId, task) => {
  const queue = getQueue(queueId);
  const res = createExpectation(task);
  queue.tasks.push(res);

  return res.id;
};

const removeExpectation = (queueId, taskId) => {
  const queue = getQueue(queueId);
  const queueIndex = queue.tasks.findIndex(res => res.id === taskId);
  queue.tasks.splice(queueIndex, 1);
};

const getAll = () => queues;

export default {
  init,
  getServerQueueId,
  addQueue,
  getQueue,
  removeQueue,
  addExpectation,
  tryRun,
  getAll,
  removeExpectation,
  run
};
