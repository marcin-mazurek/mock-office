import WebSocket from 'ws';
import WsDouble from './index';
import { DoublesEmitter } from '../servers-manager/emitter';
import Scenario from '../scenario';

describe('WsDouble', () => {
  it('should init scenario', () => {
    const wsDouble = new WsDouble({ emitter: new DoublesEmitter() });
    expect(wsDouble.getScenario()).toBeInstanceOf(Scenario);
  });

  it('should listen after start', (done) => {
    const wsDouble = new WsDouble({ port: 4000, emitter: new DoublesEmitter() });
    wsDouble.start(
      () => {
        expect(wsDouble.httpServer.listening).toBeTruthy();
        wsDouble.stop(() => {
          done();
        });
      }
    );
  });

  it('should stop gracefully', (done) => {
    const wsDouble = new WsDouble({ port: 4000, emitter: new DoublesEmitter() });
    wsDouble.start(
      () => {
        wsDouble.stop(() => {
          expect(wsDouble.httpServer.listening).toBeFalsy();
          done();
        });
      }
    );
  });

  it('should keep only one active connection', (done) => {
    const wsDouble = new WsDouble({ port: 4000, emitter: new DoublesEmitter() });
    const handleSocketCloseMock = jest.fn();
    wsDouble.wsServer.on('connection', () => {
      setTimeout(() => {
        expect(handleSocketCloseMock).toHaveBeenCalled();
        wsDouble.stop(() => {
          done();
        });
      }, 1000);
    });
    wsDouble.start(() => {
      const ws = new WebSocket('ws://127.0.0.1:4000');
      const secondWs = new WebSocket('ws://127.0.0.1:4000');
      secondWs.on('close', () => {
        handleSocketCloseMock();
        ws.close();
      });
    });
  });

  it('should play scene on CLIENT_CONNECTED', (done) => {
    const wsDouble = new WsDouble({ port: 4000, emitter: new DoublesEmitter() });
    wsDouble.getScenario().addScene({
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

    wsDouble.start(() => {
      const ws = new WebSocket('ws://127.0.0.1:4000');
      ws.on('message', (message) => {
        expect(message).toEqual('message content');
        wsDouble.stop(() => {
          done();
        });
      });
    });
  });

  it('should play scene on RECEIVED_MESSAGE', (done) => {
    const wsDouble = new WsDouble({ port: 4000, emitter: new DoublesEmitter() });
    wsDouble.getScenario().addScene({
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

    wsDouble.start(() => {
      const ws = new WebSocket('ws://127.0.0.1:4000');
      ws.on('message', (message) => {
        expect(message).toEqual('response message');
        wsDouble.stop(() => {
          done();
        });
      });
      ws.on('open', () => {
        ws.send('something');
      });
    });
  });

  it('should clear reference to last socket after close', (done) => {
    const wsDouble = new WsDouble({ port: 4000, emitter: new DoublesEmitter() });
    wsDouble.start(() => {
      const ws = new WebSocket('ws://127.0.0.1:4000');
      ws.on('open', () => {
        ws.close();
      });
      ws.on('close', () => {
        setTimeout(() => {
          expect(wsDouble.ws).not.toBeDefined();
          wsDouble.stop(() => {
            done();
          });
        }, 1000);
      });
    });
  });
});
