import { Socket } from 'net';
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
  describe('addDescription', () => {
    it('should pass description to scenario', () => {
      const scenarioAddDescriptionMock = jest.fn();
      const server = new HttpMockServer({ id: 'some id' });
      server.scenario = {
        addDescription() {
          scenarioAddDescriptionMock();
        }
      };
      server.addDescription({});
      expect(scenarioAddDescriptionMock).toHaveBeenCalled();
    });
  });

  describe('removeDescription', () => {
    it('should pass description to scenario', () => {
      const scenarioRemoveDescriptionMock = jest.fn();
      const server = new HttpMockServer({ id: 'some id' });
      server.scenario = {
        removeDescription() {
          scenarioRemoveDescriptionMock();
        }
      };
      server.removeDescription({});
      expect(scenarioRemoveDescriptionMock).toHaveBeenCalled();
    });
  });

  describe('saveSocketRef', () => {
    it('should add socket to server sockets', () => {
      const server = new HttpMockServer({ id: 'some id' });
      const netSocket = new Socket();
      server.saveSocketRef(netSocket);
      expect(server.sockets).toHaveLength(1);
      expect(server.sockets[0]).toBe(netSocket);
    });
  });

  describe('destroyOpenSockets', () => {
    it('should destroy and remove all saved sockets', () => {
      const socketDestroyMock = jest.fn();
      const server = new HttpMockServer({ id: 'some id' });
      server.sockets = [
        {
          destroy() {
            socketDestroyMock();
          }
        },
        {
          destroy() {
            socketDestroyMock();
          }
        }
      ];
      server.destroyOpenSockets();
      expect(server.sockets).toHaveLength(0);
      expect(socketDestroyMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('isLive', () => {
    const server = new HttpMockServer({ id: 'some id' });
    expect(server.isLive()).toBeFalsy();
    server.httpServer = { listening: true };
    expect(server.isLive()).toBeTruthy();
  });

  describe('stop', () => {
    it('should cancel schedulers', () => {
      const cancelSchedulersMock = jest.fn();
      const closeMock = jest.fn();
      const nodeHttpServerMock = {
        close: closeMock
      };
      const server = new HttpMockServer({ id: 'some id' });
      server.scenario = {
        cancelSchedulers: cancelSchedulersMock
      };
      server.httpServer = nodeHttpServerMock;
      server.stop();
      expect(cancelSchedulersMock).toBeCalled();
      expect(closeMock).toBeCalled();
    });

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

    it('should close server', () => {
      const server = new HttpMockServer({ id: 'some id' });
      const closeMock = jest.fn();
      server.httpServer = {
        close: closeMock
      };
      server.scenario = {
        cancelSchedulers() {}
      };
      server.stop();
      expect(closeMock).toBeCalled();
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
