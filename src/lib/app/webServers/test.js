import { Observable } from 'rxjs';

Observable
  .fromEvent((handler) => {
    app.use('*', handler);
  })
  .map((req, res) => ({
    behaviour: codex.matchBehaviour({
      type: 'request',
      params: {
        path: req.originalUrl,
        method: req.method,
        headers: req.headers
      }
    }),
    req,
    res
  }))
  .filter(({ behaviour }) => !!behaviour)
  .map(({ behaviour, req, res }) => behaviour.configBehaviour(req, res).trigger()) // reactions
  .flatMap(reactions =>
    Observable.join(reactions.map(r => r.execute()), reactions.length)
  ) // observable
  .map(behaviour => behaviour.complete()) // void
  .subscribe();
