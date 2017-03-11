import unique from 'node-unique';
import Task from 'fun-task';
import { EventEmitter } from 'events';
import R from 'ramda';
import deepEqual from 'deep-equal';
import extractSubTree from './extractSubtree';
import { events as queuesEvents } from './index';

export const events = {
  TASK_REMOVED: 'TASK_REMOVED',
  TASK_RUN: 'TASK_RUN',
  TASK_ADDED: 'TASK_ADDED'
};

export default class Queue {
  constructor(args) {
    this.id = args.id;
    this.serverId = args.serverId;
    this.queuesEmitter = args.emitter;
    this.tasks = [];
    this.emitter = new EventEmitter();
    this.runReadyTasks = this.runReadyTasks.bind(this);
    this.emitter.on(events.TASK_REMOVED, this.runReadyTasks);
    this.emitter.on(events.TASK_RUN, this.runReadyTasks);
    this.emitter.on(events.TASK_ADDED, this.runReadyTasks);
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
    this.emitter.emit(events.TASK_ADDED);

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
          this.queuesEmitter.emit(
            queuesEvents.TASK_REMOVED_AFTER_USE,
            { queueId: this.id, taskId }
          );
        }
      } else {
        this.removeTask(task.id);
        this.queuesEmitter.emit(queuesEvents.TASK_REMOVED_AFTER_USE, { queueId: this.id, taskId });
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
    this.emitter.emit(events.TASK_REMOVED);
  }

  runReadyTasks(requirements, cb) {
    if (this.tunnel) {
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
        this.tasks
      );

      if (notBlockedTasks.length === 0) {
        if (cb) {
          cb();
        }

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
        return deepEqual(task.requirements, extractSubTree(requirements, task.requirements, {}));
      });

      if (runnableTasks.length === 0) {
        if (cb) {
          cb();
        }

        return;
      }

      const firstRunnableTask = R.head(runnableTasks);

      if (cb) {
        firstRunnableTask.job.map(cb);
      }

      this.runTask(firstRunnableTask.id);
      this.emitter.emit(events.TASK_RUN);
    }
  }

  cancelPendingTasks() {
    this.tasks.forEach((task) => {
      if (task.cancel) {
        task.cancel();
      }
    });
  }

  openTunnel(tunnel) {
    this.tunnel = tunnel;
  }

  closeTunnel() {
    this.cancelPendingTasks();
    this.tunnel = undefined;
  }
}
