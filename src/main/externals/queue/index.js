import unique from 'node-unique';
import Task from 'fun-task';
import { EventEmitter } from 'events';
import R from 'ramda';
import deepEqual from 'deep-equal';
import btoa from 'btoa';
import fs from 'fs';
import vm from 'vm';

export const extractSubTree = (source, target, result) => {
  const res = result;
  const targetKeys = Object.keys(target);

  targetKeys.forEach((key) => {
    if (
      typeof target[key] === 'object' &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      res[key] = {};
      extractSubTree(source[key], target[key], res[key]);
    } else {
      res[key] = source[key];
    }
  });
  return result;
};

export const events = {
  TASK_REMOVED: 'TASK_REMOVED',
  TASK_RUN: 'TASK_RUN',
  TASK_STOPPED: 'TASK_STOPPED',
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
    let payloadGenerator;

    if (t.taskPayload === 'generator') {
      const scriptSrc = fs.readFileSync(t.generatorPath);
      payloadGenerator = new vm.Script(scriptSrc).runInNewContext({});
    }

    if (t.interval) {
      job = Task.create(() => {
        t.running = true;

        const intervalId = setInterval(
          () => {
            this.tunnel({
              taskPayload: payloadGenerator ? payloadGenerator() : t.taskPayload,
              headers: t.headers
            });
          }, t.interval);

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
            taskPayload: payloadGenerator ? payloadGenerator() : t.taskPayload,
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
          taskPayload: payloadGenerator ? payloadGenerator() : t.taskPayload,
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

    this.serverEE.emit(
      events.TASK_RUN,
      { queueId: this.id, taskId }
    );

    task.cancel = task.job.run(() => {
      task.running = false;
      this.serverEE.emit(
        events.TASK_STOPPED,
        { queueId: this.id, taskId }
      );

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

      if (task.running && task.blocking) {
        return undefined;
      } else if (!task.running) {
        if (task.requirements) {
          const req = requirements;
          if (requirements) {
            if (task.requirements.type === 'b64') {
              req.message = btoa(requirements.message);
              req.type = 'b64';
            }
            if (deepEqual(task.requirements, extractSubTree(req, task.requirements, {}))) {
              return task;
            } else if (task.blocking) {
              return undefined;
            }
          } else if (task.blocking) {
            return undefined;
          }
        } else {
          return task;
        }
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

        return;
      }

      if (cb) {
        readyTask.job = readyTask.job.map(cb);
      }

      this.runTask(readyTask.id);
      this.ee.emit(events.TASK_RUN);
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
