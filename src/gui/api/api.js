import { ConnectionError } from '../errors/types';

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
    .then(res => res.json());
