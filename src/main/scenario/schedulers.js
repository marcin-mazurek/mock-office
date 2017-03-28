/*
Utility module for choosing proper rxjs scheduler
 */

import { Scheduler } from 'rxjs';

export default () =>
  (action, onStart, onFinish) => Scheduler.asap.schedule(
    () => {
      onStart();
      action();
      onFinish();
      return () => {};
    }
  );
