import { Observable, Scheduler } from 'rxjs';
import unique from 'cuid';

export default class Reaction {
  constructor(config) {
    this.id = unique();
    this.schedule = config.schedule;
    this.params = config.params || {};
    this.type = config.type;
  }

  // schedule :: Reaction -> Observable
  static schedule({ params, schedule }) {
    const reaction$ = schedule && schedule.interval
      ? Observable.interval(schedule.interval)
        .mapTo(params)
      : Observable.from([params]);

    return schedule && schedule.delay
      ? reaction$.observeOn(Scheduler.async, schedule.delay)
      : reaction$.observeOn(Scheduler.asap);
  }
}
