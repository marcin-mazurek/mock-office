/*
 Utility module for choosing proper rxjs scheduler
 */

import { Scheduler } from 'rxjs';
import vm from 'vm';
import fs from 'fs';
import atob from 'atob';

const buildSendParams = (params, payload) =>
  Object.assign({}, params,
    {
      payload: typeof payload === 'function' ? payload() : payload
    }
  );

export default function createSchedule(taskConfig) {
  return function schedule(action, onStart, onFinish) {
    let payload;

    if (typeof taskConfig.payload !== 'undefined') {
      if (taskConfig.payload === 'generator') {
        const scriptSrc = fs.readFileSync(taskConfig.generatorPath);
        payload = new vm.Script(scriptSrc).runInNewContext({});
      } else if (taskConfig.payload.type === 'b64') {
        payload = {
          message: atob(taskConfig.payload.message)
        };
      } else {
        payload = taskConfig.payload;
      }
    }

    switch (taskConfig.type) {
      case 'immediate': {
        onStart();
        return Scheduler.asap.schedule(
          () => {
            action(buildSendParams(taskConfig.params, payload));
            onFinish();
            return () => {
            };
          }
        );
      }
      case 'future': {
        onStart();
        return Scheduler.async.schedule(
          () => {
            action(buildSendParams(taskConfig.params, payload));
            onFinish();
            return () => {
            };
          },
          taskConfig.delay
        );
      }
      case 'periodic': {
        const task = function task(repeatLimit) {
          action(buildSendParams(taskConfig.params, payload));

          if (repeatLimit !== undefined) {
            if (repeatLimit - 1 > 0) {
              this.schedule(repeatLimit - 1, taskConfig.interval);
            } else {
              onFinish();
            }
          } else {
            this.schedule(undefined, taskConfig.interval);
          }
        };
        onStart();

        return Scheduler.async.schedule(
          task,
          taskConfig.interval,
          taskConfig.repeat
        );
      }
      default: {
        onStart();
        return Scheduler.asap.schedule(
          () => {
            action(buildSendParams(taskConfig.params, payload));
            onFinish();
            return () => {
            };
          }
        );
      }
    }
  };
}
