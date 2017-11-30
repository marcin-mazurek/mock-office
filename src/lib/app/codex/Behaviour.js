import unique from 'cuid';
import Event from './Event';
import { log } from '../eventBus';
import Reaction from './Reaction';

export default class Behaviour {
  constructor(serverId, config) {
    this.serverId = serverId;
    this.event = new Event(config.event.type, config.event.params);
    this.id = unique();
    this.loadedCounter = config.loadedCounter || 1;
    this.runCounter = 0;
    this.reactions = [];
    config.reactions.forEach((reactionCfg) => {
      this.reactions.push(this.createReaction(this.id, reactionCfg));
    });
    this.pendingReactions = [];
    this.status = 'inactive';
  }

  /* eslint-disable class-methods-use-this */
  // createReaction :: (String, Object) -> Reaction
  createReaction(id, cfg) {
    return new Reaction(id, cfg);
  }
  /* eslint-enable class-methods-use-this */

  // :: void -> void
  execute() {
    if (this.runCounter === this.loadedCounter) {
      return;
    }

    this.status = Behaviour.statuses.PENDING;

    log('behaviour-status-change', {
      status: Behaviour.statuses.PENDING,
      behaviourId: this.id,
      serverId: this.serverId
    });

    let reactionsFinishedCount = 0;
    const onReactionSuccess = id => () => {
      reactionsFinishedCount += 1;

      this.pendingReactions = this.pendingReactions
        .filter(pR => pR.id !== id);
      if (reactionsFinishedCount === this.reactions.length) {
        this.status = Behaviour.statuses.FINISHED;

        log('behaviour-status-change', {
          status: Behaviour.statuses.FINISHED,
          behaviourId: this.id,
          serverId: this.serverId
        });
      }
    };

    this.pendingReactions = this.reactions.map(r => ({
      id: r.id,
      cancel: r.execute(onReactionSuccess(r.id))
    }));
    this.runCounter += 1;
  }

  // cancel :: void -> void
  cancel() {
    if (this.pendingReactions.length) {
      this.pendingReactions.forEach(pR => pR.cancel());
      this.status = Behaviour.statuses.CANCELLED;

      log('behaviour-status-change', {
        status: Behaviour.statuses.CANCELLED,
        behaviourId: this.id,
        serverId: this.serverId
      });
    }
  }
}

Behaviour.statuses = {
  INACTIVE: 'inactive',
  PENDING: 'pending',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
};
