import { Observable } from 'rxjs';
import unique from 'cuid';
import Event from './Event';
import { log } from '../eventBus';

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

  // use :: void -> Observable
  use() {
    if (this.runCounter === this.loadedCounter) {
      return null;
    }

    this.runCounter += 1;

    return Observable.merge(
      ...this.reactions.map(r => r.prepare()),
      this.reactions.length
    )
    // first emit for log start event
      .startWith(0)
      .scan(acc => acc + 1, 0)
      .do((reactionCount) => {
        if (reactionCount === 1) {
          log('server-reactions-start', {
            behaviourId: this.id,
            serverId: this.serverId
          });
        }

        if (reactionCount === this.reactions.length + 1) {
          log('server-reactions-end', {
            behaviourId: this.id,
            serverId: this.serverId
          });
        }
      });
  }
}
