import unique from 'cuid';
import { Observable, Scheduler } from 'rxjs';
import { log } from '../eventLog';

export default class Reaction {
  constructor(behaviourId, config) {
    this.id = unique();
    this.behaviourId = behaviourId;
    this.schedule = config.schedule || {};
    this.params = config.params || {};
    this.type = config.type;
    this.status = 'inactive';
  }

  // execute :: void -> Function
  execute(success) {
    let schedule$ = this.schedule.interval
      ? Observable.interval(this.schedule.interval)
      : Observable.of(1);

    schedule$ = this.schedule.delay
    ? schedule$.observeOn(Scheduler.async, this.schedule.delay)
    : schedule$.observeOn(Scheduler.queue);

    this.status = Reaction.statuses.PENDING;

    log('reaction-status-changed',
      {
        status: Reaction.statuses.PENDING,
        reactionId: this.id,
        behaviourId: this.behaviourId
      }
    );

    const subscription = schedule$
      .do(() => {
        this.doCommand();
      })
      .subscribe({
        complete: () => {
          if (success) {
            success();
          }

          this.status = Reaction.statuses.FINISHED;

          log('reaction-status-changed',
            {
              status: Reaction.statuses.FINISHED,
              reactionId: this.id,
              behaviourId: this.behaviourId
            }
          );
        }
      });

    return () => {
      subscription.unsubscribe();

      this.status = Reaction.statuses.CANCELLED;

      log('reaction-status-changed',
        {
          status: Reaction.statuses.CANCELLED,
          reactionId: this.id,
          behaviourId: this.behaviourId
        }
      );
    };
  }

  /* eslint-disable class-methods-use-this */
  // To implement by subclasses
  // action :: void -> void
  doCommand() {}
  /* eslint-enable class-methods-use-this */
}

Reaction.statuses = {
  INACTIVE: 'inactive',
  PENDING: 'pending',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
};
