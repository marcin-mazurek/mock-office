export default function requestStartServer(id) {
  return fetch('http://127.0.0.1:3060/start-server',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    .catch(() => {
      throw new Error('Connection failed.');
    })
    .then((res) => {
      if (res.status === 400) {
        return res.json().then(payload => ({ error: payload.error }));
      } else if (res.status === 404) {
        return { error: 'Server not found' };
      }

      return res.json(payload => ({ id: payload.id }));
    });
}
