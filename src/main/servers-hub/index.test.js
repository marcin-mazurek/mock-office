import ServersHub from './index';
import HttpServer from '../http-mock-server';
import WsServer from '../ws-mock-server';
import { ServerEventsEmitter } from '../globalEvents';

describe('ServerHub', () => {
  it('add should add server to servers list', () => {
    const serversHub = new ServersHub();
    const serversCount = serversHub.servers.length;
    serversHub.add('server name', 3000, 'http', false);
    expect(serversHub.servers.length).toEqual(serversCount + 1);
  });

  it('add should return id of added server and id of its queue', () => {
    const serversHub = new ServersHub();
    const serverId = serversHub.add('server name', 3000, 'http', false);
    expect(typeof serverId === 'string').toBeTruthy();
  });

  it('add should add server of type Http if we provide http type', () => {
    const serversHub = new ServersHub();
    serversHub.add('server name', 3000, 'http', false);
    expect(serversHub.servers[serversHub.servers.length - 1]).toBeInstanceOf(HttpServer);
  });

  it('add should add server of type Ws if we provide ws type', () => {
    const serversHub = new ServersHub();
    serversHub.add('server name', 3000, 'ws', false);
    expect(serversHub.servers[serversHub.servers.length - 1]).toBeInstanceOf(WsServer);
  });

  it('add should throw error if we provide unknown server type', () => {
    const serversHub = new ServersHub();
    expect(() =>
      serversHub.add('server name', 3000, 'unknown server type', false)
    ).toThrow();
  });

  it('start should call server start only if it is not running', () => {
    const serversHub = new ServersHub();
    const startMock = jest.fn();

    serversHub.servers = [
      {
        id: 'server 1',
        isLive() {
          return false;
        },
        start() {
          startMock();
        }
      },
      {
        id: 'server 2',
        isLive() {
          return true;
        },
        start() {
          startMock();
        }
      }
    ];

    serversHub.start('server 1');
    expect(startMock).toHaveBeenCalledTimes(1);
    serversHub.start('server 2');
    expect(startMock).toHaveBeenCalledTimes(1);
  });

  it('stop should call server stop if it is running', () => {
    const serversHub = new ServersHub();
    const stopMock = jest.fn();
    const serverId = 'some-id';

    serversHub.servers = [
      {
        id: serverId,
        isLive() {
          return true;
        },
        stop(cb) {
          cb();
          stopMock();
        }
      }
    ];

    serversHub.stop(serverId);
    expect(stopMock).toHaveBeenCalledTimes(1);
  });

  it('stop should not call server stop if it is not running', () => {
    const serversHub = new ServersHub();
    const stopMock = jest.fn();
    const serverId = 'some-id';

    serversHub.servers = [
      {
        id: serverId,
        isLive() {
          return false;
        },
        stop(cb) {
          stopMock();
          cb();
        }
      }
    ];

    serversHub.stop(serverId);
    expect(stopMock).not.toHaveBeenCalled();
  });

  it('find should return proper server', () => {
    const serversHub = new ServersHub();
    const server = {
      id: 'one id'
    };

    serversHub.servers = [
      server,
      {
        id: 'another id'
      }
    ];

    const foundServer = serversHub.find('one id');
    expect(foundServer).toBe(server);
  });

  it('find should return undefined if doesnt find server', () => {
    const serversHub = new ServersHub();
    const server = {
      id: 'one id',
      instance: 'server instance'
    };

    serversHub.servers = [server];

    const foundServer = serversHub.find('another id');
    expect(foundServer).toBeUndefined();
  });

  it('getAll should return new copy of all servers', () => {
    const serversHub = new ServersHub();
    expect(serversHub.getAll()).not.toBe(serversHub.servers);
    expect(serversHub.getAll()).toEqual(serversHub.servers);
  });

  it('remove should remove server with provided id', () => {
    const serversHub = new ServersHub();

    serversHub.servers = [
      {
        id: 'some id',
        isLive() {
          return false;
        }
      },
      {
        id: 'another id',
        isLive() {
          return false;
        }
      }
    ];

    serversHub.remove('some id');
    expect(serversHub.servers.length).toEqual(1);
    expect(serversHub.servers[0].id).toEqual('another id');
  });

  it('remove should do nothing when invalid id', () => {
    const serversHub = new ServersHub();

    serversHub.servers = [
      {
        id: 'some id'
      }
    ];

    serversHub.remove('invalid id');
    expect(serversHub.servers.length).toEqual(1);
  });

  it('remove should gracefully stop server before remove', () => {
    const serversHub = new ServersHub();
    const stopMockFn = jest.fn();

    serversHub.servers = [
      {
        id: 'some id',
        isLive() {
          return true;
        },
        stop(cb) {
          stopMockFn();
          cb();
        }
      }
    ];

    serversHub.remove('some id');
    expect(stopMockFn).toHaveBeenCalled();
  });

  it('should create emitter for server when adding server', () => {
    const serversHub = new ServersHub();
    serversHub.add('server name', 3000, 'http', false);
    expect(serversHub.servers[0].emitter).toBeInstanceOf(ServerEventsEmitter);
  });
});
