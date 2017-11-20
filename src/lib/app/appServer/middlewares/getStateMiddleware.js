import serversHub from '../../serversHub';

export default function configure() {
  return (req, res) => {
    res.send(serversHub.getServers().map(
      server => ({
        running: server.webServer.isLive(),
        name: server.name,
        type: server.type,
        port: server.webServer.port,
        id: server.id,
        scenario: server.webServer.player.scenario.id,
        mocks: server.webServer.player.scenario.mocks.map(mock => ({
          id: mock.id,
          runCounter: mock.runCounter,
          loadedCounter: mock.loadedCounter,
          status: mock.status,
          tasks: mock.tasks.map(task => ({
            id: task.id,
            status: task.status,
            params: task.params,
            schedule: task.scheduleParams
          }))
        }))
      })
    ));
  };
}
