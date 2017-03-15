import unique from 'node-unique';
import Task from 'fun-task';
import { EventEmitter } from 'events';
import R from 'ramda';
import deepEqual from 'deep-equal';
import extractSubTree from './extractSubtree';

export const events = {
  TASK_REMOVED: 'TASK_REMOVED',
  TASK_RUN: 'TASK_RUN',
  TASK_ADDED: 'TASK_ADDED',
  TASK_REMOVED_AFTER_USE: 'TASK_REMOVED_AFTER_USE'
};

export default class Queue {
  constructor(args) {
    this.serverEE = args.ee;
    this.tasks = [];
    this.ee = new EventEmitter();
    this.runReadyTask = this.runReadyTask.bind(this);
    this.ee.on(events.TASK_REMOVED, this.runReadyTask);
    this.ee.on(events.TASK_RUN, this.runReadyTask);
    this.ee.on(events.TASK_ADDED, this.runReadyTask);
  }

  createTask(task) {
    let job;
    const t = task;

    if (t.interval) {
      job = Task.create(() => {
        t.running = true;
        const intervalId = setInterval(() =>
          this.tunnel({
            taskPayload: t.taskPayload,
            headers: t.headers
          }), t.interval
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
          this.tunnel({
            taskPayload: t.taskPayload,
            headers: t.headers
          });
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
        this.tunnel({
          taskPayload: t.taskPayload,
          headers: t.headers
        });
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
  }

  addTask(taskConfig) {
    const task = this.createTask(taskConfig);
    this.tasks.push(task);
    this.ee.emit(events.TASK_ADDED);

    return task.id;
  }

  runTask(taskId) {
    const task = this.tasks.find(exp => exp.id === taskId);

    task.cancel = task.job.run(() => {
      task.running = false;

      if (task.reuse === 'infinite') {
        R.identity(); // do nothing
      } else if (task.reuse === 'fixed') {
        task.quantity -= 1;

        if (task.quantity === 0) {
          this.removeTask(task.id);
          this.serverEE.emit(
            events.TASK_REMOVED_AFTER_USE,
            { queueId: this.id, taskId }
          );
        }
      } else {
        this.removeTask(task.id);
        this.serverEE.emit(events.TASK_REMOVED_AFTER_USE, { queueId: this.id, taskId });
      }
    });
  }

  removeTask(taskId) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    const task = this.tasks[taskIndex];

    if (task.cancel) {
      task.cancel();
      task.cancel = undefined;
    }

    this.tasks.splice(taskIndex, 1);
    this.ee.emit(events.TASK_REMOVED);
  }

  findReadyTask(requirements) {
    for (let i = 0, len = this.tasks.length; i < len; i += 1) {
      const task = this.tasks[i];

      if (task.running) {
        if (task.blocking) {
          return undefined;
        }
      }

      if (task.requirements) {
        if (deepEqual(task.requirements, extractSubTree(requirements, task.requirements, {}))) {
          return task;
        }
      } else {
        return task;
      }
    }

    return undefined;
  }

  runReadyTask(requirements, cb) {
    if (this.tunnel) {
      const readyTask = this.findReadyTask(requirements);

      if (!readyTask) {
        if (cb) {
          cb();
        }
      } else {
        if (cb) {
          readyTask.job = readyTask.job.map(cb);
        }

        this.runTask(readyTask.id);
        this.ee.emit(events.TASK_RUN);
      }
    }
  }

  cancelPendingTasks() {
    this.tasks.forEach((task) => {
      if (task.cancel) {
        task.cancel();
      }
    });
  }

  openConnection(tunnel) {
    this.tunnel = tunnel;
  }

  closeConnection() {
    this.cancelPendingTasks();
    this.tunnel = undefined;
  }
}
