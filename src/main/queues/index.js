import unique from 'node-unique';
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
  let run;

  if (task.interval) {
    run = (cb) => {
      const intervalId = setInterval(() => cb(task.taskPayload), task.interval);

      return () => {
        clearInterval(intervalId);
      };
    };
  } else if (task.delay) {
    run = (cb, remove) => {
      const timeoutId = setTimeout(() => {
        cb(task.taskPayload);
        remove();
      }, task.delay);

      return () => {
        clearTimeout(timeoutId);
      };
    };
  } else {
    run = (cb, remove) => {
      cb(task.taskPayload);
      remove();
    };
  }

  return Object.assign(task, {
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

const addExpectation = (queueId, task) => {
  const queue = getQueue(queueId);
  const res = createExpectation(task);
  queue.tasks.push(res);

  return res.id;
};

const stop = (queueId, taskId) => {
  const currentTask = getQueue(queueId).tasks.find(task => task.id === taskId);

  if (currentTask.stop) {
    currentTask.stop();
  }
};

const removeExpectation = (queueId, taskId) => {
  const queue = getQueue(queueId);
  stop(queueId, taskId);
  const taskIndex = queue.tasks.findIndex(task => task.id === taskId);
  queue.tasks.splice(taskIndex, 1);
};

const getAll = () => queues;

const stopPendingTasks = (queueId) => {
  const queue = getQueue(queueId);
  const stoppedTasks = [];
  queue.tasks.forEach((task) => {
    if (task.stop) {
      stop(queueId, task.id);
      const stoppedTask = task;
      stoppedTask.stop = undefined;
      stoppedTasks.push(stoppedTask.id);
    }
  });

  return stoppedTasks;
};

const runTask = (queueId, taskId, serverCb) => {
  const queue = queues.find(q => q.id === queueId);
  const taskIndex = queue.tasks.findIndex(exp => exp.id === taskId);
  const task = queue.tasks[taskIndex];

  task.stop = task.run(serverCb, () => {
    removeExpectation(queueId, taskId);
    emitRemove(queueId, taskId);
  });
};

const runTaskWithRequirements = (queueId, requirements, successCb, failureCb) => {
  const queue = getQueue(queueId);
  const taskIndex = queue.tasks.findIndex(task => deepEqual(task.requirements, requirements));
  const task = queue.tasks[taskIndex];

  if (taskIndex >= 0) {
    runTask(queueId, task.id, successCb);
  } else {
    failureCb();
  }
};

export default {
  init,
  getServerQueueId,
  addQueue,
  getQueue,
  removeQueue,
  addExpectation,
  runTaskWithRequirements,
  getAll,
  removeExpectation,
  runTask,
  stopPendingTasks
};
