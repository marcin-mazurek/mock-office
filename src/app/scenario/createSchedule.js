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

export default function createSchedule(scenePart) {
  return function schedule(action, onStart, onFinish) {
    let payload;

    if (typeof scenePart.payload !== 'undefined') {
      if (scenePart.payload === 'generator') {
        const scriptSrc = fs.readFileSync(scenePart.generatorPath);
        payload = new vm.Script(scriptSrc).runInNewContext({});
      } else if (scenePart.payload.type === 'b64') {
        payload = {
          message: atob(scenePart.payload.message)
        };
      } else {
        payload = scenePart.payload;
      }
    }

    switch (scenePart.type) {
      case 'immediate': {
        onStart();
        return Scheduler.asap.schedule(
          () => {
            action(buildSendParams(scenePart.params, payload));
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
            action(buildSendParams(scenePart.params, payload));
            onFinish();
            return () => {
            };
          },
          scenePart.delay
        );
      }
      case 'periodic': {
        const task = function task(repeatLimit) {
          action(buildSendParams(scenePart.params, payload));

          if (repeatLimit !== undefined) {
            if (repeatLimit - 1 > 0) {
              this.schedule(repeatLimit - 1, scenePart.interval);
            } else {
              onFinish();
            }
          } else {
            this.schedule(undefined, scenePart.interval);
          }
        };
        onStart();

        return Scheduler.async.schedule(
          task,
          scenePart.interval,
          scenePart.repeat
        );
      }
      default: {
        onStart();
        return Scheduler.asap.schedule(
          () => {
            action(buildSendParams(scenePart.params, payload));
            onFinish();
            return () => {
            };
          }
        );
      }
    }
  };
}
