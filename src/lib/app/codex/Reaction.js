import { Observable, Scheduler } from 'rxjs';
import unique from 'cuid';

export default class Reaction {
  constructor(config) {
    this.id = unique();
    this.schedule = config.schedule;
    this.params = config.params || {};
    this.type = config.type;
    this.schedule$ = Reaction.getSchedule(config.schedule);
  }

  // getSchedule :: void -> Observable
  static getSchedule(schedule) {
    const schedule$ = schedule && schedule.interval
      ? Observable.interval(schedule.interval)
      : Observable.from(Promise.resolve());

    return schedule && schedule.delay
      ? schedule$.observeOn(Scheduler.async, schedule.delay)
      : schedule$.observeOn(Scheduler.asap);
  }
}
