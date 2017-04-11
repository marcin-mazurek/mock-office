import DoublesServers from './DoublesServers';
import HttpServer from './http-mock-server';
import WsServer from './ws-mock-server';
import { DoublesEmitter } from './emitter';

describe('ServerHub', () => {
  it('add should add server to doublesServers list', () => {
    const doublesServers = new DoublesServers();
    const doublesServersCount = doublesServers.servers.length;
    doublesServers.add('server name', 3000, 'http', false);
    expect(doublesServers.servers.length).toEqual(doublesServersCount + 1);
  });

  it('add should return id of added server and id of its queue', () => {
    const doublesServers = new DoublesServers();
    const serverId = doublesServers.add('server name', 3000, 'http', false);
    expect(typeof serverId === 'string').toBeTruthy();
  });

  it('add should add server of type Http if we provide http type', () => {
    const doublesServers = new DoublesServers();
    doublesServers.add('server name', 3000, 'http', false);
    expect(doublesServers.servers[doublesServers.servers.length - 1]).toBeInstanceOf(HttpServer);
  });

  it('add should add server of type Ws if we provide ws type', () => {
    const doublesServers = new DoublesServers();
    doublesServers.add('server name', 3000, 'ws', false);
    expect(doublesServers.servers[doublesServers.servers.length - 1]).toBeInstanceOf(WsServer);
  });

  it('add should throw error if we provide unknown server type', () => {
    const doublesServers = new DoublesServers();
    expect(() =>
      doublesServers.add('server name', 3000, 'unknown server type', false)
    ).toThrow();
  });

  it('start should call server start only if it is not running', () => {
    const doublesServers = new DoublesServers();
    const startMock = jest.fn();

    doublesServers.servers = [
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

    doublesServers.start('server 1');
    expect(startMock).toHaveBeenCalledTimes(1);
    doublesServers.start('server 2');
    expect(startMock).toHaveBeenCalledTimes(1);
  });

  it('stop should call server stop if it is running', () => {
    const doublesServers = new DoublesServers();
    const stopMock = jest.fn();
    const serverId = 'some-id';

    doublesServers.servers = [
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

    doublesServers.stop(serverId);
    expect(stopMock).toHaveBeenCalledTimes(1);
  });

  it('stop should not call server stop if it is not running', () => {
    const doublesServers = new DoublesServers();
    const stopMock = jest.fn();
    const serverId = 'some-id';

    doublesServers.servers = [
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

    doublesServers.stop(serverId);
    expect(stopMock).not.toHaveBeenCalled();
  });

  it('find should return proper server', () => {
    const doublesServers = new DoublesServers();
    const server = {
      id: 'one id'
    };

    doublesServers.servers = [
      server,
      {
        id: 'another id'
      }
    ];

    const foundServer = doublesServers.find('one id');
    expect(foundServer).toBe(server);
  });

  it('find should return undefined if doesnt find server', () => {
    const doublesServers = new DoublesServers();
    const server = {
      id: 'one id'
    };

    doublesServers.servers = [server];

    const foundServer = doublesServers.find('another id');
    expect(foundServer).toBeUndefined();
  });

  it('getAll should return new copy of all doublesServers', () => {
    const doublesServers = new DoublesServers();
    expect(doublesServers.getAll()).not.toBe(doublesServers.servers);
    expect(doublesServers.getAll()).toEqual(doublesServers.servers);
  });

  it('remove should remove server with provided id', (done) => {
    const doublesServers = new DoublesServers();
    const id = doublesServers.add('server name', 3000, 'http', false);

    doublesServers.remove(id).then(() => {
      expect(doublesServers.servers.length).toEqual(0);
      done();
    })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        done();
      });
  });

  it('remove should do nothing when invalid id', () => {
    const doublesServers = new DoublesServers();

    doublesServers.servers = [
      {
        id: 'some id'
      }
    ];

    doublesServers.remove('invalid id');
    expect(doublesServers.servers.length).toEqual(1);
  });

  it('remove should gracefully stop server before remove', () => {
    const doublesServers = new DoublesServers();
    const stopMockFn = jest.fn();

    doublesServers.servers = [
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

    doublesServers.remove('some id');
    expect(stopMockFn).toHaveBeenCalled();
  });

  it('should create emitter for server when adding server', () => {
    const doublesServers = new DoublesServers();
    doublesServers.add('server name', 3000, 'http', false);
    expect(doublesServers.servers[0].emitter).toBeInstanceOf(DoublesEmitter);
  });
});
