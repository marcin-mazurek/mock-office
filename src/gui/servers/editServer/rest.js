import { ConnectionError } from '../../resources/api/errors';

export default function requestEditServer(id, params) {
  return fetch('http://127.0.0.1:3060/edit-server', {
    method: 'POST',
    body: JSON.stringify(Object.assign({}, params, { id })),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .catch(() => {
      throw new ConnectionError();
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json().then(payload => ({ data: payload }));
      } else if (res.status === 400 || res.status === 404) {
        return res.json().then(payload => ({ error: payload.error }));
      }

      return { error: 'Server error' };
    })
    .catch(error => ({ error }));
}
