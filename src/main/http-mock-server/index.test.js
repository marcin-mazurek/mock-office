import HttpMockServer, { send } from './index';

/* eslint-disable global-require */
describe('send', () => {
  it('should send headers provide by user', () => {
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
      const server = new HttpMockServer({ id: 'some id' });
      server.sockets = [
        {
          destroy() {}
        },
        {
          destroy() {}
        }
      ];
      server.destroyOpenSockets();
      expect(server.sockets).toHaveLength(0);
    });
  });

  describe('stop', () => {
    it('should destroySockets', () => {
      const server = new HttpMockServer({ id: 'some id' });
      server.httpServer = {
        close() {}
      };
      server.scenario = {
        cancelSchedulers() {}
      };
      const destroyOpenSocketsMock = jest.fn();
      server.destroyOpenSockets = destroyOpenSocketsMock;
      server.stop();
      expect(destroyOpenSocketsMock).toBeCalled();
    });

    describe('setupResponderMiddleware', () => {
      it('should add responder to server', () => {
        const server = new HttpMockServer({ id: 'some id' });
        server.setupResponderMiddleware();
        expect(server).toHaveProperty('responder');
      });
    });

    describe('respond', () => {
      it('should schedule response if found description', () => {
        jest.resetModules();
        const scheduleMock = jest.fn();
        jest.mock('../scheduler', () => ({
          schedule: scheduleMock
        }));
        jest.mock('../scenario', () =>
          () => ({
            findDescription() {
              return {};
            }
          })
        );
        const HttpServer = require('./index').default;
        const server = new HttpServer({ id: 'some id' });
        server.respond({
          url: '/url'
        });
        expect(scheduleMock).toHaveBeenCalled();
      });
    });
  });
});
