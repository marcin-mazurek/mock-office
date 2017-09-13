export class RestError {
  constructor(message, status) {
    this.message = message;
    this.status = status;
  }
}

export class ConnectionError extends RestError {
  constructor() {
    super();
    this.message = 'Connection error';
  }
}
