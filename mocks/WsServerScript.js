server.on('connection', (ws) => {
  ws.on('message', () => {
    server.send('hello from server run by script');
  });
});
