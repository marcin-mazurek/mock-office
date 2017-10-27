export default function configure(serversManager) {
  return (req, res) => {
    res.send(serversManager.getState());
  };
}
