import express from 'express';
import request from 'request';
import HttpMockServer, { send } from './index';
import { Emitter } from '../../serversManager/emitter';

/* eslint-disable global-require */
describe('send', () => {
  it('should send CORS headers', (done) => {
    const app = express();
    app.get('*', (req, res, next) => {
      send(req, res)({
        headers: {
          key: 'value'
        }
      });
      next();
    });

    const server = app.listen(4000, () => {
      request.defaults({
        headers: {
          origin: 'origin.com'
        }
      }).get('http://127.0.0.1:4000', (error, response) => {
        server.close();
        expect(response.headers['access-control-allow-origin']).toEqual('origin.com');
        done();
      });
    });
  });

  it('should send headers provided by user', () => {
    const mockFn = jest.fn();
    const taskWithHeaders = {
      headers: {
        'header name': 'header value'
      }
    };
    const taskWithoutHeaders = {};
    const req = {
      headers: {
        origin: ''
      }
    };
    const res = {
      set(headers) {
        this.headers = Object.assign({}, this.headers, headers);
      },
      headers: {},
      json() {
        mockFn(this.headers);
      }
    };

    send(Object.create(req), Object.create(res))(taskWithHeaders);
    expect(mockFn.mock.calls[0][0]['header name']).toEqual('header value');

    send(Object.create(req), Object.create(res))(taskWithoutHeaders);
    expect(mockFn.mock.calls[1][0]['header name']).toEqual(undefined);
  });
});

describe('HttpMockServer', () => {
  it('should ensure that all sockets are destroyed and close event dispatched on stop', (done) => {
    // process.on('uncaughtException', (err) => {
    //   console.log(err.stack);
    // });
    const server = new HttpMockServer({
      port: 4000,
      id: 'some id',
      emitter: new Emitter()
    });

    server.start(
      () => {
        request('http://127.0.0.1:4000', () => {
          // we need catch error when server is destroying sockets
        });
        setTimeout(() => {
          expect(server.sockets).toHaveLength(1);
          server.stop(() => {
            expect(server.sockets).toHaveLength(0);
            done();
          });
        }, 100);
      },
      // eslint-disable-next-line no-console
      err => console.log(err)
    );
  });

  describe('destroyOpenSockets', () => {
    it('should destroy and remove all saved sockets', () => {
      const server = new HttpMockServer({
        id: 'some id',
        emitter: new Emitter()
      });
      server.sockets = [
        {
          destroy() {
          }
        },
        {
          destroy() {
          }
        }
      ];
      server.destroyOpenSockets();
      expect(server.sockets).toHaveLength(0);
    });
  });

  describe('getScenario', () => {
    it('should return server scenario', () => {
      const server = new HttpMockServer({
        id: 'some id',
        emitter: new Emitter()
      });

      expect(server.getScenario()).toBe(server.scenario);
    });
  });

  describe('respond', () => {
    it('should call scenario.play if found mock', () => {
      const server = new HttpMockServer({
        id: 'some id',
        emitter: new Emitter()
      });
      const playMock = jest.fn();

      server.scenario = {
        findMock() {
          return {};
        },
        play: playMock
      };

      server.respond(() => {
      }, () => {
      });
      expect(playMock).toHaveBeenCalled();
    });

    it('should send response to client', (done) => {
      const server = new HttpMockServer({
        port: 4000,
        id: 'some id',
        emitter: new Emitter()
      });

      server.getScenario().addMock({
        title: 'request for some-url',
        requirements: {
          event: 'RECEIVED_REQUEST'
        },
        tasks: [
          {
            title: 'response for /some-url request',
            type: 'immediate',
            payload: {
              body: {
                data: 'response for some-url'
              }
            }
          }
        ]
      });

      server.start(
        () => {
          request.get('http://127.0.0.1:4000', (error, response) => {
            server.stop();
            expect(JSON.parse(response.body)).toEqual({
              body: {
                data: 'response for some-url'
              }
            });
            done();
          });
        },
        // eslint-disable-next-line no-console
        err => console.log(err));
    });
  });

  describe('start', () => {
    it('should start http server', (done) => {
      const server = new HttpMockServer({
        port: 4000,
        emitter: new Emitter()
      });
      server.start(
        () => {
          expect(server.httpServer.listening).toBeTruthy();
          server.stop();
          done();
        },
        // eslint-disable-next-line no-console
        err => console.log(err));
    });
  });

  it('should filter mocks by request method', (done) => {
    const server = new HttpMockServer({
      port: 4000,
      emitter: new Emitter()
    });

    server.getScenario().addMock({
      requirements: {
        event: 'RECEIVED_REQUEST',
        request: {
          method: 'POST'
        }
      },
      tasks: [
        {
          type: 'immediate',
          payload: {
            message: 'its working!'
          }
        }
      ]
    });

    server.start(() => {
      request.post('http://127.0.0.1:4000', (err, res) => {
        expect(JSON.parse(res.body)).toEqual({ message: 'its working!' });

        server.getScenario().addMock({
          requirements: {
            event: 'RECEIVED_REQUEST',
            request: {
              method: 'POST'
            }
          },
          tasks: [
            {
              type: 'immediate',
              payload: {
                message: 'its working!'
              }
            }
          ]
        });

        request.get('http://127.0.0.1:4000', (error, response) => {
          expect(response.body).toEqual('Sorry, we cannot find mock.');
          server.stop(done);
        });
      });
    });
  });

  it('should filter mocks by request headers', (done) => {
    const server = new HttpMockServer({
      port: 4000,
      emitter: new Emitter()
    });

    server.getScenario().addMock({
      requirements: {
        event: 'RECEIVED_REQUEST',
        request: {
          headers: {
            origin: 'http://localhost:3000'
          }
        }
      },
      tasks: [
        {
          type: 'immediate',
          payload: {
            message: 'its working!'
          }
        }
      ]
    });

    server.start(() => {
      request.post({
        url: 'http://127.0.0.1:4000',
        headers: {
          Origin: 'http://localhost:3000'
        }
      }, (err, res) => {
        expect(JSON.parse(res.body)).toEqual({ message: 'its working!' });

        server.getScenario().addMock({
          requirements: {
            event: 'RECEIVED_REQUEST',
            request: {
              headers: {
                origin: 'http://localhost:3000'
              }
            }
          },
          tasks: [
            {
              type: 'immediate',
              payload: {
                message: 'its working!'
              }
            }
          ]
        });

        const options = {
          url: 'http://127.0.0.1:4000',
          headers: {
            origin: 'http://localhost:3456'
          }
        };

        request.get(options, (error, response) => {
          expect(response.body).toEqual('Sorry, we cannot find mock.');
          server.stop(done);
        });
      });
    });
  });

  it('should filter mocks by request url', (done) => {
    const server = new HttpMockServer({
      port: 4000,
      emitter: new Emitter()
    });

    server.getScenario().addMock({
      requirements: {
        event: 'RECEIVED_REQUEST',
        request: {
          url: '/test'
        }
      },
      tasks: [
        {
          type: 'immediate',
          payload: {
            message: 'its working!'
          }
        }
      ]
    });

    server.start(() => {
      request.get({
        url: 'http://127.0.0.1:4000/test'
      }, (err, res) => {
        expect(JSON.parse(res.body)).toEqual({ message: 'its working!' });

        server.getScenario().addMock({
          requirements: {
            event: 'RECEIVED_REQUEST',
            request: {
              url: '/test2'
            }
          },
          tasks: [
            {
              type: 'immediate',
              payload: {
                message: 'its working!'
              }
            }
          ]
        });

        request.get({ url: 'http://127.0.0.1:4000/test' }, (error, response) => {
          expect(response.body).toEqual('Sorry, we cannot find mock.');
          server.stop(done);
        });
      });
    });
  });

  it('should filter mocks by request json body', (done) => {
    const server = new HttpMockServer({
      port: 4000,
      emitter: new Emitter()
    });

    server.getScenario().addMock({
      requirements: {
        event: 'RECEIVED_REQUEST',
        request: {
          body: {
            key: 'value'
          }
        }
      },
      tasks: [
        {
          type: 'immediate',
          payload: {
            message: 'its working!'
          }
        }
      ]
    });

    server.start(() => {
      request.post({
        url: 'http://127.0.0.1:4000',
        json: true,
        body: {
          key: 'value'
        }
      }, (err, res) => {
        expect(res.body).toEqual({ message: 'its working!' });

        server.getScenario().addMock({
          requirements: {
            event: 'RECEIVED_REQUEST',
            request: {
              body: {
                key: 'proper value'
              }
            }
          },
          tasks: [
            {
              type: 'immediate',
              payload: {
                message: 'its working!'
              }
            }
          ]
        });

        request.post(
          {
            url: 'http://127.0.0.1:4000',
            json: true,
            body: {
              key: 'invalid value'
            }
          },
          (error, response) => {
            expect(response.body).toEqual('Sorry, we cannot find mock.');
            server.stop(done);
          }
        );
      })
      ;
    });
  })
    ;
  });
