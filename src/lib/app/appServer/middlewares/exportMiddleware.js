export default function configure(serversManager) {
  return (req, res) => {
    res
      .set({
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename=export.json'
      })
      .write(JSON.stringify(serversManager.getState()), 'utf-8', () => {
        res.end();
      });
  };
}
