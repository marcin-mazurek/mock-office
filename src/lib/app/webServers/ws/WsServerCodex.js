import { mergeDeepRight } from 'ramda';
import MessageBehaviour from '../ws/MessageBehaviour';
import ConnectionBehaviour from '../ws/ConnectionBehaviour';
import Codex from '../../codex';

const defaultEvent = {
  type: 'message'
};

const defaultReaction = {
  type: 'message'
};

export default class WsServerCodex extends Codex {
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
      case 'message': {
        behaviour = new MessageBehaviour(this.serverId, cfg);
        break;
      }
      case 'connection': {
        behaviour = new ConnectionBehaviour(this.serverId, cfg);
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
