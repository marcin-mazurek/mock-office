import express from 'express';
import request from 'request';
import HttpMockServer, { send } from './index';
import { Emitter } from '../servers-manager/emitter';

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
    it('should call scenario.play if found scene', () => {
      const server = new HttpMockServer({
        id: 'some id',
        emitter: new Emitter()
      });
      const playMock = jest.fn();

      server.scenario = {
        findScene() {
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

      server.getScenario().addScene({
        title: 'request for some-url',
        requirements: {
          event: 'RECEIVED_REQUEST'
        },
        parts: [
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

  it('should filter scenes by request method', (done) => {
    const server = new HttpMockServer({
      port: 4000,
      emitter: new Emitter()
    });

    server.getScenario().addScene({
      requirements: {
        event: 'RECEIVED_REQUEST',
        request: {
          method: 'POST'
        }
      },
      parts: [
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

        server.getScenario().addScene({
          requirements: {
            event: 'RECEIVED_REQUEST',
            request: {
              method: 'POST'
            }
          },
          parts: [
            {
              type: 'immediate',
              payload: {
                message: 'its working!'
              }
            }
          ]
        });

        request.get('http://127.0.0.1:4000', (error, response) => {
          expect(response.body).toEqual('Sorry, we cannot find scene.');
          server.stop(done);
        });
      });
    });
  });

  it('should filter scenes by request headers', (done) => {
    const server = new HttpMockServer({
      port: 4000,
      emitter: new Emitter()
    });

    server.getScenario().addScene({
      requirements: {
        event: 'RECEIVED_REQUEST',
        request: {
          headers: {
            origin: 'http://localhost:3000'
          }
        }
      },
      parts: [
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

        server.getScenario().addScene({
          requirements: {
            event: 'RECEIVED_REQUEST',
            request: {
              headers: {
                origin: 'http://localhost:3000'
              }
            }
          },
          parts: [
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
          expect(response.body).toEqual('Sorry, we cannot find scene.');
          server.stop(done);
        });
      });
    });
  });
});
