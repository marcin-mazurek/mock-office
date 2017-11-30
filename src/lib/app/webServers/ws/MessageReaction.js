import Reaction from '../../codex/Reaction';

export default class MessageReaction extends Reaction {
  // configureReceiver :: Socket -> void
  configureReceiver(ws) {
    this.ws = ws;
  }

  // doCommand$ :: void -> Observable
  doCommand() {
    this.ws.send(this.params.message);
  }
}
