/*
 Utility module for choosing proper rxjs scheduler
 */

import { Scheduler, Observable } from 'rxjs';

// run :: Object, Object -> Observable
export default function run(scheduleConfig, taskParams) {
  let task$;
  if (scheduleConfig.interval) {
    task$ = Observable.create((observer) => {
      const intervalId = setInterval(
        () => {
          observer.next(taskParams);
        },
        scheduleConfig.interval
      );

      return () => {
        clearInterval(intervalId);
      };
    });
  } else {
    task$ = Observable.from([taskParams]);
  }

  return scheduleConfig.delay
    ? task$.observeOn(Scheduler.async, scheduleConfig.delay)
    : task$.observeOn(Scheduler.asap);
}
