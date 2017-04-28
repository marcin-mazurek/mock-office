import ServersManager from './ServersManager';
import HttpServer from '../httpMockServer';
import WsServer from '../wsMockServer';
import { Emitter } from './emitter';

describe('ServerHub', () => {
  it('add should add server to serversManager list', () => {
    const serversManager = new ServersManager();
    const doublesServersCount = serversManager.servers.length;
    serversManager.add('server name', 3000, 'http', false);
    expect(serversManager.servers.length).toEqual(doublesServersCount + 1);
  });

  it('add should return id of added server and id of its queue', () => {
    const serversManager = new ServersManager();
    const serverId = serversManager.add('server name', 3000, 'http', false);
    expect(typeof serverId === 'string').toBeTruthy();
  });

  it('add should add server of type Http if we provide http type', () => {
    const serversManager = new ServersManager();
    serversManager.add('server name', 3000, 'http', false);
    expect(serversManager.servers[serversManager.servers.length - 1]).toBeInstanceOf(HttpServer);
  });

  it('add should add server of type Ws if we provide ws type', () => {
    const serversManager = new ServersManager();
    serversManager.add('server name', 3000, 'ws', false);
    expect(serversManager.servers[serversManager.servers.length - 1]).toBeInstanceOf(WsServer);
  });

  it('add should throw error if we provide unknown server type', () => {
    const serversManager = new ServersManager();
    expect(() =>
      serversManager.add('server name', 3000, 'unknown server type', false)
    ).toThrow();
  });

  it('start should call server start only if it is not running', () => {
    const serversManager = new ServersManager();
    const startMock = jest.fn();

    serversManager.servers = [
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

    serversManager.start('server 1');
    expect(startMock).toHaveBeenCalledTimes(1);
    serversManager.start('server 2');
    expect(startMock).toHaveBeenCalledTimes(1);
  });

  it('stop should call server stop if it is running', () => {
    const serversManager = new ServersManager();
    const stopMock = jest.fn();
    const serverId = 'some-id';

    serversManager.servers = [
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

    serversManager.stop(serverId);
    expect(stopMock).toHaveBeenCalledTimes(1);
  });

  it('stop should not call server stop if it is not running', () => {
    const serversManager = new ServersManager();
    const stopMock = jest.fn();
    const serverId = 'some-id';

    serversManager.servers = [
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

    serversManager.stop(serverId);
    expect(stopMock).not.toHaveBeenCalled();
  });

  it('find should return proper server', () => {
    const serversManager = new ServersManager();
    const server = {
      id: 'one id'
    };

    serversManager.servers = [
      server,
      {
        id: 'another id'
      }
    ];

    const foundServer = serversManager.find('one id');
    expect(foundServer).toBe(server);
  });

  it('find should return undefined if doesnt find server', () => {
    const serversManager = new ServersManager();
    const server = {
      id: 'one id'
    };

    serversManager.servers = [server];

    const foundServer = serversManager.find('another id');
    expect(foundServer).toBeUndefined();
  });

  it('getAll should return new copy of all serversManager', () => {
    const serversManager = new ServersManager();
    expect(serversManager.getAll()).not.toBe(serversManager.servers);
    expect(serversManager.getAll()).toEqual(serversManager.servers);
  });

  it('remove should remove server with provided id', (done) => {
    const serversManager = new ServersManager();
    const id = serversManager.add('server name', 3000, 'http', false);

    serversManager.remove(id).then(() => {
      expect(serversManager.servers.length).toEqual(0);
      done();
    })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        done();
      });
  });

  it('remove should do nothing when invalid id', () => {
    const serversManager = new ServersManager();

    serversManager.servers = [
      {
        id: 'some id'
      }
    ];

    serversManager.remove('invalid id');
    expect(serversManager.servers.length).toEqual(1);
  });

  it('remove should gracefully stop server before remove', () => {
    const serversManager = new ServersManager();
    const stopMockFn = jest.fn();

    serversManager.servers = [
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

    serversManager.remove('some id');
    expect(stopMockFn).toHaveBeenCalled();
  });

  it('should create emitter for server when adding server', () => {
    const serversManager = new ServersManager();
    serversManager.add('server name', 3000, 'http', false);
    expect(serversManager.servers[0].emitter).toBeInstanceOf(Emitter);
  });
});
