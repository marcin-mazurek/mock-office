export default function requestAddServer(name, port, type, isSecure, keyPath, certPath) {
  return fetch('http://127.0.0.1:3060/add-server', {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ name, port, type, isSecure, keyPath, certPath })
  })
    .catch(() => {
      throw new Error('Connection failed.');
    })
    .then((res) => {
      if (res.status === 400) {
        return res.json().then(payload => ({ error: payload.error }));
      }

      return res.json().then(payload => ({ data: { id: payload.id } }));
    });
}
