import { Observable, Scheduler } from 'rxjs';
import unique from 'cuid';
import Reaction from './Reaction';

export default class Behaviour {
  constructor(scenarioId, config) {
    this.scenarioId = scenarioId;
    this.requirements = config.requirements;
    this.id = unique();
    this.status = 'inactive';
    this.loadedCounter = config.loadedCounter || 1;
    this.runCounter = 0;
    this.reactions = config.reactions.map(reactionConfig => new Reaction(this.id, reactionConfig));
  }

  // schedule :: (Object, Object) -> Observable
  static schedule({ params: reactionParams, schedule: scheduleConfig }) {
    const reaction$ = scheduleConfig && scheduleConfig.interval
      ? Observable.interval(scheduleConfig.interval)
        .mapTo(reactionParams)
      : Observable.from([reactionParams]);

    return scheduleConfig && scheduleConfig.delay
      ? reaction$.observeOn(Scheduler.async, scheduleConfig.delay)
      : reaction$.observeOn(Scheduler.asap);
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
        ...this.reactions.map(Behaviour.schedule),
        this.reactions.length
      )
    };
  }
}
