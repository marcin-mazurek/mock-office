import WebSocket from 'ws';
import WSMockServer from './index';
import { DoubleEmitter } from '../emitter';
import Scenario from '../scenario';

describe('WSMockServer', () => {
  it('should init scenario', () => {
    const wsMockServer = new WSMockServer({ emitter: new DoubleEmitter() });
    expect(wsMockServer.getScenario()).toBeInstanceOf(Scenario);
  });

  it('should listen after start', (done) => {
    const wsMockServer = new WSMockServer({ port: 4000, emitter: new DoubleEmitter() });
    wsMockServer.start(
      () => {
        expect(wsMockServer.httpServer.listening).toBeTruthy();
        wsMockServer.stop(() => {
          done();
        });
      }
    );
  });

  it('should stop gracefully', (done) => {
    const wsMockServer = new WSMockServer({ port: 4000, emitter: new DoubleEmitter() });
    wsMockServer.start(
      () => {
        wsMockServer.stop(() => {
          expect(wsMockServer.httpServer.listening).toBeFalsy();
          done();
        });
      }
    );
  });

  it('should keep only one active connection', (done) => {
    const wsMockServer = new WSMockServer({ port: 4000, emitter: new DoubleEmitter() });
    const handleSocketCloseMock = jest.fn();
    wsMockServer.wsServer.on('connection', () => {
      setTimeout(() => {
        expect(handleSocketCloseMock).toHaveBeenCalled();
        wsMockServer.stop(() => {
          done();
        });
      }, 1000);
    });
    wsMockServer.start(() => {
      const ws = new WebSocket('ws://127.0.0.1:4000');
      const secondWs = new WebSocket('ws://127.0.0.1:4000');
      secondWs.on('close', () => {
        handleSocketCloseMock();
        ws.close();
      });
    });
  });

  it('should play scene on CLIENT_CONNECTED', (done) => {
    const wsMockServer = new WSMockServer({ port: 4000, emitter: new DoubleEmitter() });
    wsMockServer.getScenario().addScene({
      requirements: {
        event: 'CLIENT_CONNECTED'
      },
      parts: [
        {
          type: 'immediate',
          payload: {
            message: 'message content',
          }
        }
      ]
    });

    wsMockServer.start(() => {
      const ws = new WebSocket('ws://127.0.0.1:4000');
      ws.on('message', (message) => {
        expect(message).toEqual('message content');
        wsMockServer.stop(() => {
          done();
        });
      });
    });
  });

  it('should play scene on RECEIVED_MESSAGE', (done) => {
    const wsMockServer = new WSMockServer({ port: 4000, emitter: new DoubleEmitter() });
    wsMockServer.getScenario().addScene({
      requirements: {
        event: 'RECEIVED_MESSAGE'
      },
      parts: [
        {
          type: 'immediate',
          payload: {
            message: 'response message',
          }
        }
      ]
    });

    wsMockServer.start(() => {
      const ws = new WebSocket('ws://127.0.0.1:4000');
      ws.on('message', (message) => {
        expect(message).toEqual('response message');
        wsMockServer.stop(() => {
          done();
        });
      });
      ws.on('open', () => {
        ws.send('something');
      });
    });
  });

  it('should clear reference to last socket after close', (done) => {
    const wsMockServer = new WSMockServer({ port: 4000, emitter: new DoubleEmitter() });
    wsMockServer.start(() => {
      const ws = new WebSocket('ws://127.0.0.1:4000');
      ws.on('open', () => {
        ws.close();
      });
      ws.on('close', () => {
        setTimeout(() => {
          expect(wsMockServer.ws).not.toBeDefined();
          wsMockServer.stop(() => {
            done();
          });
        }, 1000);
      });
    });
  });
});
