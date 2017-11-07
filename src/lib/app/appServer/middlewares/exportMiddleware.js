import serversHub from '../../serversHub';

export default function configure() {
  return (req, res) => {
    res
      .set({
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename=export.json'
      })
      .write(JSON.stringify(serversHub.getState()), 'utf-8', () => {
        res.end();
      });
  };
}
