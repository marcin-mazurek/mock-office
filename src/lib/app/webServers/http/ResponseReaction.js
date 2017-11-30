import Reaction from '../../codex/Reaction';

export default class ResponseReaction extends Reaction {
  // configureReceiver :: (http.ClientRequest, http.ServerResponse) -> void
  configureReceiver(req, res) {
    this.req = req;
    this.res = res;
  }

  doCommand() {
    // allow CORS by default
    if (this.req.headers.origin) {
      this.res.set('Access-Control-Allow-Origin', this.req.headers.origin);
    }

    if (this.params.headers) {
      this.res.set(this.params.headers);
    }

    if (this.params.status) {
      this.res.status(this.params.status);
    }

    this.res.json(this.params.payload);
  }
}
