import serversHub from '../../serversHub';
import { serverToResponse } from './transformers';

export default function configure() {
  return (req, res) => {
    res.send(serversHub.getServers().map(serverToResponse));
  };
}
