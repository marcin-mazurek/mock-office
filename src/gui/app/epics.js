export default action$ =>
  action$.ofType('SAVE_STATE')
    .map(() => {
      window.location = 'http://127.0.0.1:3060/export';
      return true;
    })
    .mapTo({ type: 'SAVE_STATE_COMPLETE' });
