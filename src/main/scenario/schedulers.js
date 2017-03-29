/*
Utility module for choosing proper rxjs scheduler
 */

import { Scheduler } from 'rxjs';

export default scenePart =>
  (action, onStart, onFinish) => {
    switch (scenePart.type) {
      case 'immediate': {
        onStart();
        return Scheduler.asap.schedule(
          () => {
            action();
            onFinish();
            return () => {};
          }
        );
      }
      case 'future': {
        onStart();
        return Scheduler.async.schedule(
          () => {
            action();
            onFinish();
            return () => {};
          },
          scenePart.delay
        );
      }
      case 'periodic': {
        const task = function task(repeatLimit) {
          action();

          if (repeatLimit !== undefined) {
            if (repeatLimit - 1 > 0) {
              this.schedule(repeatLimit - 1, scenePart.interval);
            } else {
              onFinish();
            }
          } else {
            this.schedule(null, scenePart.interval);
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
            action();
            onFinish();
            return () => {};
          }
        );
      }
    }
  };
