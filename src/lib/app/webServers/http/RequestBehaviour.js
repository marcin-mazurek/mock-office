import Behaviour from '../../codex/Behaviour';
import ResponseReaction from './ResponseReaction';

export default class RequestBehaviour extends Behaviour {
  configureReceiver(req, res) {
    this.reactions
      .filter(r => r instanceof ResponseReaction)
      .forEach(r => r.configureReceiver(req, res));
  }

  createReaction(reactionCfg) {
    if (this.reactions.length > 1) {
      throw new Error('RequestBehaviour can have only single reaction.');
    }

    let reaction;

    if (reactionCfg.type === 'response') {
      reaction = new ResponseReaction(reactionCfg);
    } else {
      throw new Error(`Invalid reaction type: ${reactionCfg.type}`);
    }

    return reaction;
  }
}
