import unique from 'cuid';
import { Scheduler, Observable, Subject } from 'rxjs';
import { pipe, tap, ifElse, F } from 'ramda';

export default class Task {
  constructor(mockId, config) {
    this.mockId = mockId;
    this.id = unique();
    this.status = 'inactive';
    this.scheduleParams = config.schedule;
    this.params = config.params || {};
    this.start = this.start.bind(this);
    this.cancel = this.cancel.bind(this);
    this.status$ = new Subject();
  }

  // schedule :: (Object, Object) -> Observable
  static schedule(taskParams, scheduleConfig) {
    const task$ = scheduleConfig && scheduleConfig.interval
      ? Observable.interval(scheduleConfig.interval)
        .mapTo(taskParams)
      : Observable.from([taskParams]);

    return scheduleConfig && scheduleConfig.delay
      ? task$.observeOn(Scheduler.async, scheduleConfig.delay)
      : task$.observeOn(Scheduler.asap);
  }

  // start :: void -> Observable
  start() {
    return ifElse(
      () => this.status !== 'inactive',
      F,
      pipe(
        (scheduleParams, params) =>
          Task.schedule(params, scheduleParams)
            .multicast(new Subject())
            .refCount()
            .takeUntil(
              this.status$.filter(status => status === 'cancelled')
            ),
        tap((schedule$) => {
          schedule$.subscribe({
            next: () => {
              this.status$.next('done');
            },
            complete: () => {
              if (this.status !== 'cancelled') {
                this.status = 'finished';
                this.status$.next('finished');
              }
              this.status$.complete();
            }
          });
          this.status = 'scheduled';
          this.status$.next('scheduled');
        })
      )
    )(this.scheduleParams, this.params);
  }

  // getStatusChanges :: void -> Observable
  getStatusChanges() {
    return this.status$
      .map(status => ({
        taskId: this.id,
        mockId: this.mockId,
        status
      }));
  }

  // cancel :: void -> void
  cancel() {
    if (this.status === 'scheduled') {
      this.status = 'cancelled';
      this.status$.next('cancelled');
    }
  }

  // kill :: void -> void
  kill() {
    if (this.status === 'scheduled') {
      this.cancel();
      return;
    }

    this.status$.complete();
  }
}
