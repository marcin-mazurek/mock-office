import Request from './Request';
import Response from './Response';

export default class Expectation {
  constructor(id, cfg) {
    this.id = id;
    this.request = new Request(cfg.request);
    this.response = new Response(cfg.response);
    this.serverId = cfg.serverId;
  }
}
