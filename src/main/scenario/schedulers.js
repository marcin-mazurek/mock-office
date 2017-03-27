/*
Utility module for choosing proper rxjs scheduler
 */

import { Scheduler } from 'rxjs';

export default () =>
  (scene, onStart, onFinish) => Scheduler.asap.schedule(
    () => {
      onStart();
      scene();
      onFinish();
      return () => {};
    }
  );
