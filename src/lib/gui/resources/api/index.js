import { ConnectionError } from './errors';

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

        return { error: 'Unknown server response' };
      })
      .catch((error) => {
        if (error instanceof ConnectionError) {
          return { error: error.message };
        }

        throw new Error(error.message);
      });
  },
  addMock(server, scenario, mock) {
    return fetch('http://127.0.0.1:3060/add-mock', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ server, scenario, mock })
    })
      .catch(() => {
        throw new ConnectionError();
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json().then(payload => payload.id);
        } else if (res.status === 400) {
          return res.json().then(payload => ({ error: payload.error }));
        } else if (res.status === 404) {
          return { error: 'Server not found' };
        }

        return { error: 'Unknown server response' };
      });
  },
  getMock(serverId, scenarioId, mockId) {
    return fetch(`http://127.0.0.1:3060/mock?id=${mockId}&server=${serverId}&scenario=${scenarioId}`, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .catch(() => {
        throw new ConnectionError();
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 400) {
          return res.json().then(payload => ({ error: payload.error }));
        } else if (res.status === 404) {
          return { error: 'Mock not found' };
        }

        return { error: 'Unknown server response' };
      })
      .catch((error) => {
        if (error instanceof ConnectionError) {
          return { error: error.message };
        }

        throw new Error(error.message);
      });
  },
  startServer(params) {
    return catchConnectionErrors(
      fetch('http://127.0.0.1:3060/start-server',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        })
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json().then(payload => ({ data: payload }));
        } else if (res.status === 400) {
          return res.json().then(payload => ({ error: payload.error }));
        } else if (res.status === 404) {
          return { error: 'Server not found' };
        }

        return { error: 'Unknown server response' };
      })
      .catch((error) => {
        if (error instanceof ConnectionError) {
          return { error: error.message };
        }

        throw new Error(error.message);
      });
  },
  stopServer(params) {
    return fetch('http://127.0.0.1:3060/stop-server', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .catch(() => {
        throw new ConnectionError();
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json().then(payload => ({ data: { id: payload.id } }));
        } else if (res.status === 400) {
          return res.json().then(payload => ({ error: payload.error }));
        } else if (res.status === 404) {
          return { error: 'Server not found' };
        }

        return { error: 'Unknown server response' };
      })
      .catch((error) => {
        if (error instanceof ConnectionError) {
          return { error: error.message };
        }

        throw new Error(error.message);
      });
  },
  removeServer(params) {
    return catchConnectionErrors(
      fetch('http://127.0.0.1:3060/remove-server', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
    )
      .then((res) => {
        if (res.status === 200) {
          return {
            data: {
              id: params.id
            }
          };
        } else if (res.status === 400) {
          return res.json()
            .then(payload => ({
              error: payload[0].message
            }));
        } else if (res.status === 404) {
          return {
            error: 'Wrong id provided when removing server'
          };
        }

        return { error: 'Unknown server response' };
      })
      .catch((error) => {
        if (error instanceof ConnectionError) {
          return { error: error.message };
        }

        throw new Error(error.message);
      });
  },
  editServer(params) {
    return fetch('http://127.0.0.1:3060/edit-server', {
      method: 'POST',
      body: JSON.stringify(params),
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
        } else if (res.status === 400) {
          return res.json().then(payload => ({ error: payload.error }));
        } else if (res.status === 404) {
          return { error: 'That server does\'nt exist' };
        }

        return { error: 'Server error' };
      })
      .catch((error) => {
        if (error instanceof ConnectionError) {
          return { error: error.message };
        }

        throw new Error(error.message);
      });
  },
  removeMock(params) {
    return fetch('http://127.0.0.1:3060/remove-mock', {
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
          return {
            scenarioId: params.scenarioId,
            mockId: params.mockId
          };
        } else if (res.status === 400) {
          return res.json().then(payload => ({ error: payload.error }));
        } else if (res.status === 404) {
          return { error: 'That mock does\'nt exist' };
        }

        return { error: 'Server error' };
      })
      .catch((error) => {
        if (error instanceof ConnectionError) {
          return { error: error.message };
        }

        throw new Error(error.message);
      });
  }
};
