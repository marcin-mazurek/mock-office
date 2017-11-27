import Reaction from '../../codex/Reaction';

export default class MessageReaction extends Reaction {
  // configureReceiver :: Socket -> void
  configureReceiver(ws) {
    this.ws = ws;
  }

  // prepare :: void -> Observable
  prepare() {
    return this.schedule$
      .do(() => {
        const { params, ws } = this;
        ws.send(params.message);
      });
  }
}
