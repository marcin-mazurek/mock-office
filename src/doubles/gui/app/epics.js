import wsConnect from '../wsConnect';

export default action$ =>
  action$.ofType('SAVE_STATE')
    .map(() => {
      wsConnect.socket.send('SAVE_STATE');
      return { type: 'SAVE_STATE_COMPLETE' };
    });
