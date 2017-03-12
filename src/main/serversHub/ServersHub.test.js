import ServersHub from './ServersHub';
import HttpServer from './HttpServer';
import WsServer from './WsServer';

const serversHub = new ServersHub();

test('serversHub.add should add server to servers list', () => {
  const serversCount = serversHub.servers.length;
  serversHub.add('server name', 3000, 'http', false);
  expect(serversHub.servers.length).toEqual(serversCount + 1);
});

test('serversHub.add should return id of added server and id of its queue', () => {
  const serverId = serversHub.add('server name', 3000, 'http', false);
  expect(typeof serverId === 'string').toBeTruthy();
});

test('serversHub.add should add server of type Http if we provide http type', () => {
  serversHub.add('server name', 3000, 'http', false);
  expect(serversHub.servers[serversHub.servers.length - 1].instance).toBeInstanceOf(HttpServer);
});

test('serversHub.add should add server of type Ws if we provide ws type', () => {
  serversHub.add('server name', 3000, 'ws', false);
  expect(serversHub.servers[serversHub.servers.length - 1].instance).toBeInstanceOf(WsServer);
});

test('serversHub.add should throw error if we provide unknown server type', () => {
  expect(() =>
    serversHub.add('server name', 3000, 'unknown server type', false)
  ).toThrow();
});

test('serversHub.start should call server start if it is not running', () => {
  const mockFn = jest.fn();
  const serverId = 'some-id';

  serversHub.servers = [
    {
      id: serverId,
      instance: {
        isLive() {
          return false;
        },
        start(cb) {
          cb();
          mockFn(0);
        }
      }
    }
  ];

  serversHub.start(serverId);
  expect(mockFn.mock.calls.length).toEqual(1);
});

test('serversHub.start should not call server start if it is running', () => {
  const mockFn = jest.fn();
  const serverId = 'some-id';

  serversHub.servers = [
    {
      id: serverId,
      instance: {
        isLive() {
          return true;
        },
        start(cb) {
          cb();
          mockFn();
        }
      }
    }
  ];

  serversHub.start(serverId);
  expect(mockFn.mock.calls.length).toEqual(0);
});

test('serversHub.stop should call server stop if it is running', () => {
  const mockFn = jest.fn();
  const serverId = 'some-id';

  serversHub.servers = [
    {
      id: serverId,
      instance: {
        isLive() {
          return true;
        },
        stop(cb) {
          cb();
          mockFn();
        }
      }
    }
  ];

  serversHub.stop(serverId);
  expect(mockFn.mock.calls.length).toEqual(1);
});

test('serversHub.stop should not call server stop if it is not running', () => {
  const mockFn = jest.fn();
  const serverId = 'some-id';

  serversHub.servers = [
    {
      id: serverId,
      instance: {
        isLive() {
          return false;
        },
        stop(cb) {
          mockFn();
          cb();
        }
      }
    }
  ];

  serversHub.stop(serverId);
  expect(mockFn.mock.calls.length).toEqual(0);
});

test('serversHub.find should return proper server', () => {
  const server = {
    id: 'one id',
    instance: 'server instance'
  };

  serversHub.servers = [server];

  const foundServer = serversHub.find('one id');
  expect(foundServer).toEqual('server instance');
});

test('serversHub.find should return undefined if doesnt find server', () => {
  const server = {
    id: 'one id',
    instance: 'server instance'
  };

  serversHub.servers = [server];

  const foundServer = serversHub.find('another id');
  expect(foundServer).toBeUndefined();
});

test('serversHub.getAll should return new copy of all servers', () => {
  expect(serversHub.getAll()).not.toBe(serversHub.servers);
  expect(serversHub.getAll()).toEqual(serversHub.servers);
});
