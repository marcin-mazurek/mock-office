((server) => {
  server.get('*', (req, res) => {
    res.send('hello from server run by script');
  });
});
