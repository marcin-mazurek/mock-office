import servers from './index';
import HttpServer from './httpServer';
import WsServer from './wsServer';

test('servers.add should add server to state', () => {
  const serversCount = servers.getAll().length;
  servers.add('server name', 3000, 'http', false);
  expect(servers.getAll().length).toEqual(serversCount + 1);
});

test('servers.add should return id of added server and id of its queue', () => {
  const addedServerDetails = servers.add('server name', 3000, 'http', false);
  expect(Object.keys(addedServerDetails)).toContain('serverId');
  expect(Object.keys(addedServerDetails)).toContain('queueId');
});

test('servers.add should add server of type Http if we provide http type', () => {
  servers.add('server name', 3000, 'http', false);
  expect(servers.getAll()[servers.getAll().length - 1]).toBeInstanceOf(HttpServer);
});

test('servers.add should add server of type Ws if we provide ws type', () => {
  servers.add('server name', 3000, 'ws', false);
  expect(servers.getAll()[servers.getAll().length - 1]).toBeInstanceOf(WsServer);
});

test('servers.add should throw error if we provide unknown server type', () => {
  expect(() =>
    servers.add('server name', 3000, 'unknown server type', false)
  ).toThrow();
});

test('servers.start should return promise that server will start if find server', () => {
  const { serverId } = servers.add('server name', 3000, 'http', false);
  expect(servers.start(serverId)).toBeInstanceOf(Promise);
});

test('servers.start should throw when it doesn\'t find server', () => {
  expect(servers.start('some unknown server Id')).toThrow();
});

test('servers.stop should return promise that server will stop, if it find server', () => {
  const { serverId } = servers.add('server name', 3000, 'http', false);
  expect(servers.stop(serverId)).toBeInstanceOf(Promise);
});

test('servers.stop should throw when it doesn\'t find server', () => {
  expect(() => { servers.stop('some unknown server Id'); }).toThrow();
});

afterEach(() => {
  servers.getAll().forEach((server) => { servers.stop(server.id); });
});
