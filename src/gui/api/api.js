import { ConnectionError } from '../errors/types';
import { ValidationError, ServerNotFoundError } from '../servers/startServer/errors';

/* eslint-disable import/prefer-default-export */
export const requestAddMock = (serverId, mock) =>
  fetch('http://127.0.0.1:3060/add-mock', {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ serverId, mock })
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
    }))
    .then(
      res => [
        serverId,
        res.id,
        mock.title,
        mock.interval,
        mock.reuse,
        mock.quantity,
        mock.delay,
        mock.requirements,
        mock.tasks.map((task, index) => {
          // eslint-disable-next-line no-param-reassign
          task.id = res.tasks[index];
          return task;
        })
      ]
    );
