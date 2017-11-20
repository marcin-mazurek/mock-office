export const reactionToResponse = reaction => ({
  id: reaction.id,
  status: reaction.status,
  params: reaction.params,
  schedule: reaction.scheduleParams
});

export const behaviourToResponse = behaviour => ({
  id: behaviour.id,
  runCounter: behaviour.runCounter,
  loadedCounter: behaviour.loadedCounter,
  status: behaviour.status,
  tasks: behaviour.reactions.map(reactionToResponse)
});

export const serverToResponse = server => ({
  running: server.webServer.isLive(),
  name: server.name,
  type: server.type,
  port: server.webServer.port,
  id: server.id,
  scenario: server.webServer.codex.scenario.id,
  mocks: server.webServer.codex.scenario.behaviours.map(behaviourToResponse)
});
