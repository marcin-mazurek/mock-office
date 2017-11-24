import MessageBehaviour from '../ws/MessageBehaviour';
import ConnectionBehaviour from '../ws/ConnectionBehaviour';
import Codex from '../../codex';

export default class WsServerCodex extends Codex {
  constructor(serverId) {
    super(serverId);
    this.addBehaviour = this.addBehaviour.bind(this);
  }

  // addBehaviour :: Object -> Behaviour
  addBehaviour(behaviourCfg) {
    let behaviour;

    switch (behaviourCfg.event.type) {
      case 'message': {
        behaviour = new MessageBehaviour(this.serverId, behaviourCfg);
        break;
      }
      case 'connection': {
        behaviour = new ConnectionBehaviour(this.serverId, behaviourCfg);
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
