export default class Response {
  constructor(args) {
    this.headers = args.headers || {};
    this.type = args.type || 'application/json';
    this.body = args.body || {};
  }
}
