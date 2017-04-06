import Double from './Double';
import HttpServer from './http-mock-server';
import WsServer from './ws-mock-server';
import ServerEventsEmitter from './ServerEventsEmitter';

describe('ServerHub', () => {
  it('add should add server to servers list', () => {
    const double = new Double();
    const serversCount = double.servers.length;
    double.add('server name', 3000, 'http', false);
    expect(double.servers.length).toEqual(serversCount + 1);
  });

  it('add should return id of added server and id of its queue', () => {
    const double = new Double();
    const serverId = double.add('server name', 3000, 'http', false);
    expect(typeof serverId === 'string').toBeTruthy();
  });

  it('add should add server of type Http if we provide http type', () => {
    const double = new Double();
    double.add('server name', 3000, 'http', false);
    expect(double.servers[double.servers.length - 1]).toBeInstanceOf(HttpServer);
  });

  it('add should add server of type Ws if we provide ws type', () => {
    const double = new Double();
    double.add('server name', 3000, 'ws', false);
    expect(double.servers[double.servers.length - 1]).toBeInstanceOf(WsServer);
  });

  it('add should throw error if we provide unknown server type', () => {
    const double = new Double();
    expect(() =>
      double.add('server name', 3000, 'unknown server type', false)
    ).toThrow();
  });

  it('start should call server start only if it is not running', () => {
    const double = new Double();
    const startMock = jest.fn();

    double.servers = [
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

    double.start('server 1');
    expect(startMock).toHaveBeenCalledTimes(1);
    double.start('server 2');
    expect(startMock).toHaveBeenCalledTimes(1);
  });

  it('stop should call server stop if it is running', () => {
    const double = new Double();
    const stopMock = jest.fn();
    const serverId = 'some-id';

    double.servers = [
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

    double.stop(serverId);
    expect(stopMock).toHaveBeenCalledTimes(1);
  });

  it('stop should not call server stop if it is not running', () => {
    const double = new Double();
    const stopMock = jest.fn();
    const serverId = 'some-id';

    double.servers = [
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

    double.stop(serverId);
    expect(stopMock).not.toHaveBeenCalled();
  });

  it('find should return proper server', () => {
    const double = new Double();
    const server = {
      id: 'one id'
    };

    double.servers = [
      server,
      {
        id: 'another id'
      }
    ];

    const foundServer = double.find('one id');
    expect(foundServer).toBe(server);
  });

  it('find should return undefined if doesnt find server', () => {
    const double = new Double();
    const server = {
      id: 'one id'
    };

    double.servers = [server];

    const foundServer = double.find('another id');
    expect(foundServer).toBeUndefined();
  });

  it('getAll should return new copy of all servers', () => {
    const double = new Double();
    expect(double.getAll()).not.toBe(double.servers);
    expect(double.getAll()).toEqual(double.servers);
  });

  it('remove should remove server with provided id', (done) => {
    const double = new Double();
    const id = double.add('server name', 3000, 'http', false);

    double.remove(id).then(() => {
      expect(double.servers.length).toEqual(0);
      done();
    })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        done();
      });
  });

  it('remove should do nothing when invalid id', () => {
    const double = new Double();

    double.servers = [
      {
        id: 'some id'
      }
    ];

    double.remove('invalid id');
    expect(double.servers.length).toEqual(1);
  });

  it('remove should gracefully stop server before remove', () => {
    const double = new Double();
    const stopMockFn = jest.fn();

    double.servers = [
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

    double.remove('some id');
    expect(stopMockFn).toHaveBeenCalled();
  });

  it('should create emitter for server when adding server', () => {
    const double = new Double();
    double.add('server name', 3000, 'http', false);
    expect(double.servers[0].emitter).toBeInstanceOf(ServerEventsEmitter);
  });
});
