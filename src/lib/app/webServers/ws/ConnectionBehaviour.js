import Behaviour from '../../codex/Behaviour';
import MessageReaction from './MessageReaction';

export default class ConnectionBehaviour extends Behaviour {
  configureReceiver(ws) {
    this.reactions
      .filter(r => r instanceof MessageReaction)
      .forEach(r => r.configureReceiver(ws));
  }

  // eslint-disable-next-line class-methods-use-this
  createReaction(reactionCfg) {
    let reaction;

    if (reactionCfg.type === 'message') {
      reaction = new MessageReaction(reactionCfg);
    } else {
      throw new Error(`Invalid reaction type: ${reactionCfg.type}`);
    }

    return reaction;
  }
}
