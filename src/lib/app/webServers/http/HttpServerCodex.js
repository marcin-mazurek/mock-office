import { mergeDeepRight } from 'ramda';
import RequestBehaviour from './RequestBehaviour';
import Codex from '../../codex';

const defaultEvent = {
  type: 'request'
};

const defaultReaction = {
  type: 'response'
};

export default class HttpServerCodex extends Codex {
  constructor(serverId) {
    super(serverId);
    this.addBehaviour = this.addBehaviour.bind(this);
  }

  // addBehaviour :: Object -> Behaviour
  addBehaviour(behaviourCfg) {
    let behaviour;
    const cfg = mergeDeepRight({ event: defaultEvent }, behaviourCfg);
    cfg.reactions = cfg.reactions.map(r => mergeDeepRight(defaultReaction, r));

    switch (cfg.event.type) {
      case 'request': {
        behaviour = new RequestBehaviour(this.serverId, cfg);
        break;
      }
      default: {
        throw new Error('Invalid behaviour event type');
      }
    }

    this.behaviours.push(behaviour);
    return behaviour;
  }
}
