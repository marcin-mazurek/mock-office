((wss) => {
  wss.on('connection', (ws) => {
    ws.on('message', () => {
      ws.send('hello from server run by script');
    });
  });
});
