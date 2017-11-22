import { Observable, Scheduler } from 'rxjs';
import unique from 'cuid';
import Task from './Task';

export default class Behaviour {
  constructor(scenarioId, config) {
    this.scenarioId = scenarioId;
    this.requirements = config.requirements;
    this.id = unique();
    this.status = 'inactive';
    this.loadedCounter = config.loadedCounter || 1;
    this.runCounter = 0;
    this.tasks = config.tasks.map(taskConfig => new Task(this.id, taskConfig));
  }

  // schedule :: (Object, Object) -> Observable
  static schedule({ params: taskParams, schedule: scheduleConfig }) {
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
    if (this.runCounter === this.loadedCounter) {
      return null;
    }

    this.runCounter += 1;

    return {
      behaviourId: this.id,
      scenarioId: this.scenarioId,
      reactions: Observable
      .merge(
        ...this.tasks.map(Behaviour.schedule),
        this.tasks.length
      )
    };
  }
}
