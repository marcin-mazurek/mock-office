import { ConnectionError } from '../../errors/types';

export default function requestAddServer(params) {
  return fetch('http://127.0.0.1:3060/add-server', {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(params)
  })
    .catch(() => {
      throw new ConnectionError();
    })
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
}
