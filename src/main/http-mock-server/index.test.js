import express from 'express';
import request from 'request';
import HttpMockServer, { send } from './index';
import { ServerEventsEmitter } from '../globalEvents';

/* eslint-disable global-require */
describe('send', () => {
  it('should send CORS headers', (done) => {
    const app = express();
    app.get('*', (req, res, next) => {
      send(req, res)({
        taskPayload: {
          key: 'value'
        }
      });
      next();
    });

    const server = app.listen(3005, () => {
      request.defaults({
        headers: {
          origin: 'origin.com'
        }
      }).get('http://127.0.0.1:3005', (error, response) => {
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
      port: 3000,
      id: 'some id',
      emitter: new ServerEventsEmitter()
    });

    server.start(() => {
      request('http://127.0.0.1:3000', () => {
        // we need catch error when server is destroying sockets
      });
      setTimeout(() => {
        expect(server.sockets).toHaveLength(1);
        server.stop(() => {
          expect(server.sockets).toHaveLength(0);
          done();
        });
      }, 100);
    });
  });

  describe('destroyOpenSockets', () => {
    it('should destroy and remove all saved sockets', () => {
      const server = new HttpMockServer({
        id: 'some id',
        emitter: new ServerEventsEmitter()
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
        emitter: new ServerEventsEmitter()
      });

      expect(server.getScenario()).toBe(server.scenario);
    });
  });

  describe('respond', () => {
    it('should call scenario.play if found scene', () => {
      const server = new HttpMockServer({
        id: 'some id',
        emitter: new ServerEventsEmitter()
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
        port: 3003,
        id: 'some id',
        emitter: new ServerEventsEmitter()
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

      server.start(() => {
        request.get('http://127.0.0.1:3003', (error, response) => {
          server.stop();
          expect(JSON.parse(response.body)).toEqual({
            body: {
              data: 'response for some-url'
            }
          });
          done();
        });
      });
    });
  });

  describe('start', () => {
    it('should start http server', (done) => {
      const server = new HttpMockServer({
        emitter: new ServerEventsEmitter()
      });
      server.start(() => {
        expect(server.httpServer.listening).toBeTruthy();
        server.stop();
        done();
      });
    });
  });
});
