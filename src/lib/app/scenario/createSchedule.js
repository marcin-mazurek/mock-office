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

export default function createSchedule(scheduleConfig, taskParams) {
  return function runSchedule(action, onStart, onFinish) {
    let payload;

    if (typeof taskParams.payload !== 'undefined') {
      if (taskParams.payload === 'generator') {
        const scriptSrc = fs.readFileSync(taskParams.generatorPath);
        payload = new vm.Script(scriptSrc).runInNewContext({});
      } else if (taskParams.payload.type === 'b64') {
        payload = {
          message: atob(taskParams.payload.message)
        };
      } else {
        payload = taskParams.payload;
      }
    }

    const task = () => {
      action(buildSendParams(taskParams, payload));
      onFinish();
    };

    if (scheduleConfig.interval) {
      const task = function task(repeatLimit) {
        action(buildSendParams(taskParams, payload));

        if (repeatLimit !== undefined) {
          if (repeatLimit - 1 > 0) {
            this.schedule(repeatLimit - 1, scheduleConfig.interval);
          } else {
            onFinish();
          }
        } else {
          this.schedule(undefined, scheduleConfig.interval);
        }
      };
      onStart();

      return Scheduler.async.schedule(
        task,
        scheduleConfig.interval,
        scheduleConfig.repeat
      );
    } else if (scheduleConfig.delay) {
      onStart();
      return Scheduler.async.schedule(
        () => {

          return () => {
          };
        },
        scheduleConfig.delay
      );
    }

    onStart();
    return Scheduler.asap.schedule(
      () => {
        action(buildSendParams(taskParams, payload));
        onFinish();
        return () => {
        };
      }
    );
  };
}
