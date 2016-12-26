import Request from './Request';
import Response from './Response';

export default class Expectation {
  constructor(args) {
    this.request = new Request(args.request);
    this.response = new Response(args.response);
    this.serverId = args.serverId;
  }
}
