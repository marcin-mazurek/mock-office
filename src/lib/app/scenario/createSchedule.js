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

export default function createSchedule(scheduleConfig, params) {
  return function runSchedule(action, onStart, onFinish) {
    let payload;

    if (typeof params.payload !== 'undefined') {
      if (params.payload === 'generator') {
        const scriptSrc = fs.readFileSync(params.generatorPath);
        payload = new vm.Script(scriptSrc).runInNewContext({});
      } else if (params.payload.type === 'b64') {
        payload = {
          message: atob(params.payload.message)
        };
      } else {
        payload = params.payload;
      }
    }

    if (scheduleConfig.interval) {
      const task = function task(repeatLimit) {
        action(buildSendParams(params, payload));

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
          action(buildSendParams(params, payload));
          onFinish();
          return () => {
          };
        },
        scheduleConfig.delay
      );
    }

    onStart();
    return Scheduler.asap.schedule(
      () => {
        action(buildSendParams(params, payload));
        onFinish();
        return () => {
        };
      }
    );
  };
}
