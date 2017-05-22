import { ConnectionError } from '../errors/types';
import { ValidationError, ServerNotFoundError } from '../servers/startServer/errors';

/* eslint-disable import/prefer-default-export */
export const requestAddMock = (server, scenario, mock) =>
  fetch('http://127.0.0.1:3060/add-mock', {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ server, scenario, mock })
  })
    .catch(() => {
      throw new ConnectionError('Connection failed.');
    })
    .then(res => res.json().then((payload) => {
      if (res.status === 400) {
        throw new ValidationError(payload.error);
      } else if (res.status === 404) {
        throw new ServerNotFoundError('Server not found');
      }

      return payload;
    }));
