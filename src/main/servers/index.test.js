import serversHub from './index';
import HttpServer from './httpServer';
import WsServer from './wsServer';

test('servers.add should add server to state', () => {
  const serversCount = serversHub.getAll().length;
  serversHub.add('server name', 3000, 'http', false);
  expect(serversHub.servers.length).toEqual(serversCount + 1);
});

test('serversHub.add should return id of added server and id of its queue', () => {
  const addedServerDetails = serversHub.add('server name', 3000, 'http', false);
  expect(Object.keys(addedServerDetails)).toContain('serverId');
  expect(Object.keys(addedServerDetails)).toContain('queueId');
});

test('serversHub.add should add server of type Http if we provide http type', () => {
  serversHub.add('server name', 3000, 'http', false);
  expect(serversHub.getAll()[serversHub.getAll().length - 1]).toBeInstanceOf(HttpServer);
});

test('serversHub.add should add server of type Ws if we provide ws type', () => {
  serversHub.add('server name', 3000, 'ws', false);
  expect(serversHub.getAll()[serversHub.getAll().length - 1]).toBeInstanceOf(WsServer);
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
      isLive() {
        return false;
      },
      start(cb) {
        cb();
        mockFn(0);
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
      isLive() {
        return true;
      },
      start(cb) {
        cb();
        mockFn();
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
      isLive() {
        return true;
      },
      stop(cb) {
        cb();
        mockFn();
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
      isLive() {
        return false;
      },
      stop(cb) {
        cb();
        mockFn();
      }
    }
  ];

  serversHub.stop(serverId);
  expect(mockFn.mock.calls.length).toEqual(0);
});
