import EventEmitter from 'events';
import unique from 'cuid';
import { Scheduler, Observable } from 'rxjs';
import { tap, pipe, ifElse } from 'ramda';

export default class Task extends EventEmitter {
  constructor(config) {
    super();
    this.id = unique();
    this.pending = false;
    this.scheduleParams = config.schedule || {};
    this.params = config.params || {};
  }

  static schedule(scheduleConfig, taskParams) {
    const task$ = scheduleConfig.interval
      ? Observable.interval(scheduleConfig.interval)
        .mapTo(taskParams)
      : Observable.from([taskParams]);

    return scheduleConfig.delay
      ? task$.observeOn(Scheduler.async, scheduleConfig.delay)
      : task$.observeOn(Scheduler.asap);
  }

  // void -> [Observable]
  play() {
    return ifElse(
      () => this.pending,
      () => 'Pending task cant be run',
      pipe(
        Task.schedule,
        tap((task$) => {
          this.pending = true;
          this.emit('start');
          this.subscription = task$.subscribe({
            complete: () => {
              this.pending = false;
              this.subscription = null;
              this.emit('end');
            }
          });
        })
      )
    )(this.scheduleParams, this.params);
  }

  // void -> void
  cancel() {
    if (this.pending) {
      this.subscription.unsubscribe();
      this.subscription = null;
      this.pending = false;
      this.emit('cancel');
    }
  }
}
