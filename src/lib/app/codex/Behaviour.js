import { Observable } from 'rxjs';
import unique from 'cuid';
import Event from './Event';
import eventBus from '../eventBus';

export default class Behaviour {
  constructor(serverId, config) {
    this.serverId = serverId;
    this.event = new Event(config.event.type, config.event.params);
    this.id = unique();
    this.loadedCounter = config.loadedCounter || 1;
    this.runCounter = 0;
    this.reactions = [];
    config.reactions.forEach((reactionCfg) => {
      this.reactions.push(this.createReaction(reactionCfg));
    });
  }

  configureReceiver(receiver) {
    this.reactions.forEach(r => r.configureReceiver(receiver));
  }

  // trigger :: void -> void
  trigger() {
    if (this.runCounter === this.loadedCounter) {
      return;
    }

    this.runCounter += 1;

    eventBus.emit('server-reactions-start', {
      behaviourId: this.id,
      serverId: this.serverId
    });
    this.subscription = Observable.merge(
      ...this.reactions.map(r => r.prepare()),
      this.reactions.length
    ).subscribe({
      complete: () => {
        eventBus.emit('server-reactions-end', {
          behaviourId: this.id,
          serverId: this.serverId
        });
      }
    });
  }

  cancel() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
      eventBus.emit('server-reactions-cancel', {
        behaviourId: this.id,
        serverId: this.serverId
      });
    }
  }
}
