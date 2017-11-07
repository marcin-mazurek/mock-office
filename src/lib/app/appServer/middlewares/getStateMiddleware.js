import serversHub from '../../serversHub';

export default function configure() {
  return (req, res) => {
    res.send(serversHub.getState());
  };
}
