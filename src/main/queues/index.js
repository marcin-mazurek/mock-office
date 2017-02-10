import unique from 'node-unique';
import deepEqual from 'deep-equal';
import { TASK_REMOVED } from '../common/messageNames';

const queues = [];

let mainWin;

const init = (mW) => {
  mainWin = mW;
};

const emitRemove = (queueId, taskId) => {
  mainWin.webContents.send(TASK_REMOVED, { queueId, taskId });
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
const removeQueue = (serverId) => {
  queues.filter(queue => queue.serverId !== serverId);
};

const removeTask = (queueId, taskId) => {
  const queue = getQueue(queueId);
  const taskIndex = queue.tasks.findIndex(task => task.id === taskId);
  const task = queue.tasks[taskIndex];

  if (task.cancel) {
    task.cancel();
  }
  queue.tasks.splice(taskIndex, 1);
};

const runReadyTasks = (queueId, requirements, cb) => {
  const queue = getQueue(queueId);
  const tasksToRun = [];

  if (queue.tunnel) {
    let blocked = false;
    let taskIndex = 0;

    // collect tasks
    while (taskIndex < queue.tasks.length && !blocked) {
      let shouldRun = false;
      const task = queue.tasks[taskIndex];

      if (task.run) { // is not run yet
        if (task.requirements) { // should fulfill requirements
          if (deepEqual(task.requirements, requirements)) {
            shouldRun = true;
          }
        } else { // without requirements
          shouldRun = true;
        }
      }

      if (shouldRun) {
        tasksToRun.push(task);
      } else if (task.behaviours && task.behaviours.blocking) {
        blocked = true;
      }

      taskIndex += 1;
    }

    // run tasks
    let runTasks = 0;

    if (tasksToRun.length > 0) {
      tasksToRun.forEach((t) => {
        const tToRun = t;

        tToRun.cancel = tToRun.run(() => {
          tToRun.cancel = undefined;
          removeTask(queueId, tToRun.id);
          emitRemove(queueId, tToRun.id);
          runTasks += 1;

          if (runTasks === tasksToRun.length && cb) {
            cb();
          }
        });
        tToRun.run = undefined;
      });
    } else if (cb) {
      cb();
    }
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

const runTask = (queueId, taskId, serverCb) => {
  const queue = queues.find(q => q.id === queueId);
  const taskIndex = queue.tasks.findIndex(exp => exp.id === taskId);
  const task = queue.tasks[taskIndex];

  task.cancel = task.run(serverCb, () => {
    removeTask(queueId, taskId);
    emitRemove(queueId, taskId);
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
  removeQueue,
  addTask,
  runReadyTasks,
  getAll,
  removeTask,
  runTask,
  cancelPendingTasks,
  openTunnel,
  closeTunnel
};
