import { ConnectionError } from '../errors/types';
import { ValidationError, ServerNotFoundError } from '../servers/errors';

// eslint-disable-next-line import/prefer-default-export
export const requestStartServer = id =>
  fetch('http://127.0.0.1:3060/start-server',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    .catch(() => {
      throw new ConnectionError('Connection failed.');
    })
    .then((res) => {
      if (res.status === 400) {
        throw new ValidationError(res.error);
      } else if (res.status === 404) {
        throw new ServerNotFoundError('Server not found');
      }

      return res;
    })
    .then(res => res.json());
