import Behaviour from '../../codex/Behaviour';
import ResponseReaction from './ResponseReaction';

export default class RequestBehaviour extends Behaviour {
  // configureReceiver :: (http.ClientRequest, http.ServerResponse) -> RequestBehaviour
  configureReceiver(req, res) {
    this.reactions
      .filter(r => r instanceof ResponseReaction)
      .forEach(r => r.configureReceiver(req, res));
    return this;
  }

  // createReaction :: Object -> ResponseReaction
  createReaction(id, reactionCfg) {
    if (this.reactions.length > 1) {
      throw new Error('RequestBehaviour can have only single reaction.');
    }

    let reaction;

    if (reactionCfg.type === 'response') {
      reaction = new ResponseReaction(id, reactionCfg);
    } else {
      throw new Error(`Invalid reaction type: ${reactionCfg.type}`);
    }

    return reaction;
  }
}
