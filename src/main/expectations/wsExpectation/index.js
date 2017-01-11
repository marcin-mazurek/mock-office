export default class WsExpectation {
  constructor(id, cfg) {
    this.id = id;
    this.incomingMessage = cfg.incomingMessage;
    this.responseMessage = cfg.responseMessage;
  }
}
