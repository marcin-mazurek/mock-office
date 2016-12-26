export default class Request {
  constructor(args) {
    this.url = args.url;
    this.method = args.method || 'GET';
    this.payload = args.payoad;
  }
}
