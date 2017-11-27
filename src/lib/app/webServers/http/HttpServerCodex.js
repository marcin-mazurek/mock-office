import RequestBehaviour from './RequestBehaviour';
import Codex from '../../codex';

export default class HttpServerCodex extends Codex {
  constructor(serverId) {
    super(serverId);
    this.addBehaviour = this.addBehaviour.bind(this);
  }

  // addBehaviour :: Object -> Behaviour
  addBehaviour(behaviourCfg) {
    let behaviour;

    switch (behaviourCfg.event.type) {
      case 'request': {
        behaviour = new RequestBehaviour(this.serverId, behaviourCfg);
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
