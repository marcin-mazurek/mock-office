import unique from 'node-unique';
import deepEqual from 'deep-equal';
import R from 'ramda';
import { TASK_REMOVED } from '../common/messageNames';

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
  let run;

  if (task.interval) {
    run = () => {
      const intervalId = setInterval(() =>
        queue.tunnel(task.taskPayload), task.interval
      );

      return () => {
        clearInterval(intervalId);
      };
    };
  } else if (task.delay) {
    run = (end) => {
      const timeoutId = setTimeout(() => {
        queue.tunnel(task.taskPayload);
        end();
      }, task.delay);

      return () => {
        clearTimeout(timeoutId);
      };
    };
  } else {
    run = (end) => {
      queue.tunnel(task.taskPayload);
      end();
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

const removeTask = (queueId, taskId) => {
  const queue = getQueue(queueId);
  const taskIndex = queue.tasks.findIndex(task => task.id === taskId);
  const task = queue.tasks[taskIndex];

  if (task.cancel) {
    task.cancel();
  }
  queue.tasks.splice(taskIndex, 1);
};

const emitRemove = (queueId, taskId) => {
  mainWin.webContents.send(TASK_REMOVED, { queueId, taskId });
};

const runTask = (queueId, taskId, cb) => {
  const queue = queues.find(q => q.id === queueId);
  const task = queue.tasks.find(exp => exp.id === taskId);

  task.cancel = task.run(() => {
    task.run = undefined;
    task.cancel = undefined;
    removeTask(queueId, task.id);
    emitRemove(queueId, task.id);

    if (cb) {
      cb();
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

        blockingTaskFound = task.behaviours && task.behaviours.blocking;
        return true;
      },
      queue.tasks
    );

    if (notBlockedTasks.length === 0) {
      return;
    }

    const runnableTasks = notBlockedTasks.filter((task) => {
      const running = !task.run;

      if (running) {
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
    runTask(queueId, firstRunnableTask.id, () => {
      if (cb) {
        cb();
      }
      runReadyTasks(queueId);
    });
  }
};

const addTask = (queueId, task) => {
  const queue = getQueue(queueId);
  const res = createTask(queue, task);
  queue.tasks.push(res);

  if (queue.tunnel) {
    runReadyTasks(queueId);
  }

  return res.id;
};

const getAll = () => queues;

const cancelPendingTasks = (queueId) => {
  const queue = getQueue(queueId);

  queue.tasks = queue.tasks.map((task) => {
    const t = task;

    if (t.cancel) {
      t.cancel(queueId, task.id);
      t.cancel = undefined;
    }

    return t;
  });
};

const openTunnel = (queueId, tunnel) => {
  const queue = getQueue(queueId);
  queue.tunnel = tunnel;
  runReadyTasks(queueId);
};

const closeTunnel = (queueId) => {
  const queue = getQueue(queueId);
  cancelPendingTasks(queueId);
  queue.tunnel = undefined;
};

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
