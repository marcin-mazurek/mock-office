import unique from 'node-unique';
import deepEqual from 'deep-equal';
import R from 'ramda';
import Task from 'fun-task';
import { EventEmitter } from 'events';
import { TASK_REMOVED } from '../common/messageNames';

const events = {
  TASK_REMOVED: 'TASK_REMOVED',
  TASK_RUN: 'TASK_RUN',
  TASK_ADDED: 'TASK_ADDED'
};

const emitter = new EventEmitter();
const queues = [];

let mainWin;

const init = (mW) => {
  mainWin = mW;
};

const createQueue = serverId => ({
  id: unique(),
  serverId,
  tasks: []
});

const createTask = (queue, task) => {
  let job;
  const t = task;

  if (t.interval) {
    job = Task.create(() => {
      t.running = true;
      const intervalId = setInterval(() =>
        queue.tunnel(t.taskPayload), t.interval
      );

      return () => {
        t.running = false;
        clearInterval(intervalId);
      };
    });
  } else if (t.delay) {
    job = Task.create((onSuccess) => {
      t.running = true;
      const timeoutId = setTimeout(() => {
        queue.tunnel(t.taskPayload);
        onSuccess();
      }, t.delay);

      return () => {
        t.running = false;
        clearTimeout(timeoutId);
      };
    });
  } else {
    job = Task.create((onSuccess) => {
      t.running = true;
      queue.tunnel(t.taskPayload);
      onSuccess();

      return () => {
        t.running = false;
      };
    });
  }

  return Object.assign(t, {
    id: unique(),
    job
  });
};

const addQueue = (serverId) => {
  const q = createQueue(serverId);
  queues.push(q);

  return q.id;
};

const getQueue = id => queues.find(q => q.id === id);

const removeTask = (queueId, taskId) => {
  const queue = getQueue(queueId);
  const taskIndex = queue.tasks.findIndex(task => task.id === taskId);
  const task = queue.tasks[taskIndex];

  if (task.cancel) {
    task.cancel();
    task.cancel = undefined;
  }

  queue.tasks.splice(taskIndex, 1);
  emitter.emit(events.TASK_REMOVED, queueId);
};

const emitRemove = (queueId, taskId) => {
  mainWin.webContents.send(TASK_REMOVED, { queueId, taskId });
};

const runTask = (queueId, taskId) => {
  const queue = queues.find(q => q.id === queueId);
  const task = queue.tasks.find(exp => exp.id === taskId);

  task.cancel = task.job.run(() => {
    task.running = false;

    if (task.reuse !== 'infinite') {
      removeTask(queueId, task.id);
      emitRemove(queueId, task.id);
    }
  });
};

const runReadyTasks = (queueId, requirements, cb) => {
  const queue = getQueue(queueId);

  if (queue.tunnel) {
    // collect phase
    let blockingTaskFound = false;
    const notBlockedTasks = R.takeWhile(
      (task) => {
        if (blockingTaskFound) {
          return false;
        }

        blockingTaskFound = task.behaviours;
        return true;
      },
      queue.tasks
    );

    if (notBlockedTasks.length === 0) {
      return;
    }

    const runnableTasks = notBlockedTasks.filter((task) => {
      if (task.running) {
        return false;
      }

      // do not need
      if (!task.requirements) {
        return true;
      }

      // should fulfill requirements
      return deepEqual(task.requirements, requirements);
    });

    if (runnableTasks.length === 0) {
      return;
    }

    const firstRunnableTask = R.head(runnableTasks);

    if (cb) {
      firstRunnableTask.job.map(cb);
    }

    runTask(queueId, firstRunnableTask.id);
    emitter.emit(events.TASK_RUN, queueId);
  }
};

const addTask = (queueId, task) => {
  const queue = getQueue(queueId);
  const res = createTask(queue, task);
  queue.tasks.push(res);

  emitter.emit(events.TASK_ADDED, queueId);

  return res.id;
};

const getAll = () => queues;

const cancelPendingTasks = (queueId) => {
  const queue = getQueue(queueId);

  queue.tasks.forEach((task) => {
    if (task.cancel) {
      task.cancel();
    }
  });
};

const openTunnel = (queueId, tunnel) => {
  const queue = getQueue(queueId);
  queue.tunnel = tunnel;
};

const closeTunnel = (queueId) => {
  const queue = getQueue(queueId);
  cancelPendingTasks(queueId);
  queue.tunnel = undefined;
};

emitter.on(events.TASK_REMOVED, queueId => runReadyTasks(queueId));
emitter.on(events.TASK_RUN, queueId => runReadyTasks(queueId));
emitter.on(events.TASK_ADDED, queueId => runReadyTasks(queueId));

export default {
  init,
  addQueue,
  getQueue,
  addTask,
  runReadyTasks,
  getAll,
  removeTask,
  runTask,
  cancelPendingTasks,
  openTunnel,
  closeTunnel
};
