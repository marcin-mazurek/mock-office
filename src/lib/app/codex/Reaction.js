import { Observable, Scheduler } from 'rxjs';
import unique from 'cuid';

export default class Reaction {
  constructor(config) {
    this.id = unique();
    this.schedule = config.schedule;
    this.params = config.params || {};
  }

  // schedule :: Reaction -> Observable
  static schedule({ params, schedule }) {
    const task$ = schedule && schedule.interval
      ? Observable.interval(schedule.interval)
        .mapTo(params)
      : Observable.from([params]);

    return schedule && schedule.delay
      ? task$.observeOn(Scheduler.async, schedule.delay)
      : task$.observeOn(Scheduler.asap);
  }
}
