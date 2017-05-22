import { ConnectionError } from './errors';
import { ValidationError, ServerNotFoundError } from '../servers/startServer/errors';

function catchConnectionErrors(promise) {
  return promise.catch(() => {
    throw new ConnectionError();
  });
}

export default {
  addServer(params) {
    return catchConnectionErrors(
      fetch('http://127.0.0.1:3060/add-server', {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(params)
      })
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json().then(resPayload => ({ data: resPayload }));
        } else if (res.status === 400) {
          return res.json().then(resPayload => ({ error: resPayload.error }));
        }

        throw new Error(`Unsupported API status: ${res.status}`);
      })
      .catch((error) => {
        let errorMessage;
        if (error instanceof ConnectionError) {
          errorMessage = error.message;
        } else {
          throw new Error(error.message);
        }

        return { error: errorMessage };
      });
  },
  addMock(server, scenario, mock) {
    return catchConnectionErrors(
      fetch('http://127.0.0.1:3060/add-mock', {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ server, scenario, mock })
      })
    )
      .catch(() => {
        throw new ConnectionError('Connection failed.');
      })
      .then(res =>
        res.json().then((payload) => {
          if (res.status === 400) {
            throw new ValidationError(payload.error);
          } else if (res.status === 404) {
            throw new ServerNotFoundError('Server not found');
          }

          return payload;
        })
      );
  }
};
