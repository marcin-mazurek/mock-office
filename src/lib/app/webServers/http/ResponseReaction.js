import Reaction from '../../codex/Reaction';

export default class ResponseReaction extends Reaction {
  configureReceiver(req, res) {
    this.req = req;
    this.res = res;
  }

  prepare() {
    return this.schedule$
      .do(() => {
        const { params, req, res } = this;

        // allow CORS by default
        if (req.headers.origin) {
          res.set('Access-Control-Allow-Origin', req.headers.origin);
        }

        if (params.headers) {
          res.set(params.headers);
        }

        if (params.status) {
          res.status(params.status);
        }

        res.json(params.payload);
      });
  }
}
