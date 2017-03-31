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
});
