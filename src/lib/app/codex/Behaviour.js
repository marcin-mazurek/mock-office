import { Observable } from 'rxjs';
import unique from 'cuid';
import Reaction from './Reaction';

export default class Behaviour {
  constructor(config) {
    this.action = config.requirements;
    this.id = unique();
    this.loadedCounter = config.loadedCounter || 1;
    this.runCounter = 0;
    this.reactions = config.tasks.map(reactionCfg => new Reaction(reactionCfg));
  }

  // use :: void -> Object
  use() {
    if (this.runCounter === this.loadedCounter) {
      return null;
    }

    this.runCounter += 1;

    return {
      behaviourId: this.id,
      reactions: Observable.merge(
        ...this.reactions.map(Reaction.schedule),
        this.reactions.length
      )
    };
  }
}
