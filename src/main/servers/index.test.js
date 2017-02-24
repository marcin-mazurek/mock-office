import serversHub from './index';
import HttpServer from './httpServer';
import WsServer from './wsServer';

test('servers.add should add server to state', () => {
  const serversCount = serversHub.getAll().length;
  serversHub.add('server name', 3000, 'http', false);
  expect(serversHub.getAll().length).toEqual(serversCount + 1);
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

test('serversHub.start should start server if it is not running', () => {
  const { serverId } = serversHub.add('server name', 3000, 'http', false);
  expect(serversHub.start(serverId)).toBeInstanceOf(Promise);
});

test('serversHub.start should throw when it doesn\'t find server', () => {
  expect(serversHub.start('some unknown server Id')).toThrow();
});

test('serversHub.stop should return promise that server will stop, if it find server', () => {
  const { serverId } = serversHub.add('server name', 3000, 'http', false);
  expect(serversHub.stop(serverId)).toBeInstanceOf(Promise);
});

test('serversHub.stop should throw when it doesn\'t find server', () => {
  expect(() => { serversHub.stop('some unknown server Id'); }).toThrow();
});

afterEach(() => {
  serversHub.getAll().forEach((server) => { serversHub.stop(server.id); });
});
